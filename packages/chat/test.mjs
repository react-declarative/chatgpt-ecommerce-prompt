import repl from "repl";

import { execute } from './src/ai.mjs';

async function run(uInput, context, filename, callback) {
    const result = await execute(uInput);
    callback(null, result);
}
  
repl.start({ prompt: "chatgpt-repl => ", eval: run });