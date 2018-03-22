const fs = require('fs');
const { removeSync } = require('fs-extra')

const indexPath = './build/index.html';
const index = fs.readFileSync(indexPath, { encoding: 'utf-8' });

const jsCacheVersion = /static\/js\/main\.(.+)\.js/.exec(index)[1];

const cssLink = `./build/${(/\<link href=\"(.*?\.css)\".*?\\?\>/.exec(index))[1]}`;
const cssContent = fs.readFileSync(cssLink, { encoding: 'utf-8' })
.replace(/\/\*.+?\*\//g, '')
.replace(/\n/g, '');

const newIndex = index
.replace(/<link\ href\=\".*?\.css\".*?rel\=\"stylesheet\".*?>/g, `<style>${cssContent}</style>`);

fs.unlinkSync(indexPath);
fs.writeFileSync(indexPath, newIndex, { encoding: 'utf-8' });

removeSync('./build/static/css');

const swPath = './build/sw.js';
const sw = fs.readFileSync(swPath, { encoding: 'utf-8' });
const newSw = sw.replace('{{cache-version}}', new Date() - 1)
    .replace('{{js-cache-version}}', jsCacheVersion);

fs.unlinkSync(swPath);
fs.writeFileSync(swPath, newSw, { encoding: 'utf-8' });

console.log('DONE');