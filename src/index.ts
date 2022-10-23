import { readFile, writeFile } from 'fs/promises';
import * as core from '@actions/core';
import * as io from '@actions/io';
import { compile } from 'tempura';
import path from 'path';

async function run() {
  try {

    const input = path.resolve('template/index.hbs');
    core.info('input path' + input)
    const outputDir = path.resolve(__dirname, 'docs');
    core.info('output dir' + outputDir);
    const output = path.resolve(__dirname, 'docs/index.html');
    core.info('output path' + output);
    const defaultDoc = await io.which('docs/readme.md', true);
    core.info('default doc' + defaultDoc);
    const fallbackDoc = await io.which('readme.md', true);
    core.info('fallback doc' + fallbackDoc);

    await io.mkdirP('docs');


    if(defaultDoc.length == 0){
      core.info('Please place your readme in your \'docs\' folder');
      if(fallbackDoc.length !== 0){
        core.info('exist fallback');
        io.cp('readme.md', 'docs/readme.md')
      } else {
        core.info('Please place your readme in your project root');
      }
    }

    const template = await readFile(input, 'utf8');
    const render = compile(template);
    const html = await render({
      title: 'Reminders',
      items: [
        { id: 1, text: 'Feed the doggo' },
        { id: 2, text: 'Buy groceries' },
        { id: 3, text: 'Exercise, ok' },
      ]
    });

    writeFile(output, html, {encoding: 'utf-8'});
    core.info('html ' + html);
    
    core.setOutput('output', output);
  } catch (error: any) {
    core.setFailed(error.message);
  }
}

run();
