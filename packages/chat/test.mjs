import repl from "repl";

import { execute } from './src/ai.mjs';

async function run(uInput, context, filename, callback) {
    console.log('Generating answer, please wait');
    console.log('Fan goes hisssssss');
    const result = await execute(uInput);
    callback(null, result);
}
  
repl.start({ prompt: "chatgpt-repl => ", eval: run });