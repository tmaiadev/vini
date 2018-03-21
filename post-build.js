const fs = require('fs');
const { removeSync } = require('fs-extra')

const indexPath = './build/index.html';
const index = fs.readFileSync(indexPath, { encoding: 'utf-8' });

const cssLink = `./build/${(/\<link href=\"(.*?\.css)\".*?\\?\>/.exec(index))[1]}`;
const cssContent = fs.readFileSync(cssLink, { encoding: 'utf-8' })
.replace(/\/\*.+?\*\//g, '')
.replace(/\n/g, '');

const newIndex = index
.replace(/<link\ href\=\".*?\.css\".*?rel\=\"stylesheet\".*?>/g, `<style>${cssContent}</style>`);

fs.unlinkSync(indexPath);
fs.writeFileSync(indexPath, newIndex, { encoding: 'utf-8' });

removeSync('./build/static/css');

console.log('DONE');