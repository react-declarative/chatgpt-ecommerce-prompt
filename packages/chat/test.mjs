import repl from "repl";

import { execute } from './src/ai.mjs';

async function run(uInput, context, filename, callback) {
    console.log('Generating answer, please wait (fan goes hisssssss)');
    console.time('Timing');
    const result = await execute(uInput);
    console.timeEnd('Timing');
    callback(null, result);
}
  
repl.start({ prompt: "chatgpt-repl => ", eval: run });