import { createCompletion, loadModel } from "gpt4all";
import { ChromaClient } from 'chromadb'
import { v4 as uuid } from 'uuid';
import fs from 'fs';

const DATABASE_ID =  uuid();

const model = await loadModel("Nous-Hermes-2-Mistral-7B-DPO.Q4_0.gguf");

const chroma = new ChromaClient({ path: "http://localhost:8000" });
const collection = await chroma.getOrCreateCollection({ name: DATABASE_ID });

const { data: PRODUCT_DATA } = JSON.parse(fs.readFileSync('../../db.json').toString());
const CONTEXT_PROMPT = fs.readFileSync('../../PROMPT.txt').toString();

const loadData = async () => {
    console.log(`Using database ${DATABASE_ID}`);
    if (await collection.count()) {
        console.log('Ready');
        return;
    }
    console.log('Uploading documents');
    const ids = [];
    const documents = [];
    const metadatas = [];
    PRODUCT_DATA.forEach((item) => {
        ids.push(`${item.id}`);
        documents.push(item.details);
        metadatas.push(item);
    });
    const result = await collection.add({
        ids,
        documents,
        metadatas,
      });
    if (result.error) {
        console.error(result.error);
        throw new Error();
    }
    console.log('Ready');
}

await loadData();

const getChat = (() => {
    let chat = null;
    return async () => {
        if (!chat) {
            chat = await model.createChatSession({
                temperature: 0.8,
                systemPrompt: `### System:\nMake the client buy the product\n\n`,
            });
        }
        return chat;
    }
})();

export const execute = async (question) => {

    const queryData = await collection.query({
        queryTexts: [question],
      });

    const context = queryData.metadatas.length ? queryData.documents.slice(0, 10).map((value, idx) => `Product number ${idx + 1} description: ${value}\n`): [nothingFound];

    const chat = await getChat();

    const prompt = [
        `${CONTEXT_PROMPT}`,
        `Question:`,
        `=========`,
        `${question}`,
        `=========`,
        `Product list:`,
        `=========`,
        ...context,
        `=========`,
        `Recommendation:`,
    ].join('\n');

    const res1 = await createCompletion(chat, prompt);

    return res1.choices[0].message.content;

}


