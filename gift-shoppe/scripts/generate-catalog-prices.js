const fs = require('fs');
const path = require('path');

const productsPath = path.join(__dirname, '../src/data/products.js');
const outputPath = path.join(__dirname, '../src/data/catalogPrices.json');
const functionsOutputPath = path.join(__dirname, '../functions/data/catalogPrices.json');

const source = fs.readFileSync(productsPath, 'utf8');
const prices = {};
const pattern = /\{\s*id:\s*'([^']+)',\s*name:\s*'(?:\\'|[^']*)',\s*price:\s*(\d+)/g;
let match = pattern.exec(source);

while (match) {
  prices[match[1]] = Number(match[2]);
  match = pattern.exec(source);
}

const json = `${JSON.stringify(prices, null, 2)}\n`;
fs.writeFileSync(outputPath, json);
fs.mkdirSync(path.dirname(functionsOutputPath), { recursive: true });
fs.writeFileSync(functionsOutputPath, json);

console.log(`Synced ${Object.keys(prices).length} catalog prices → src/data and functions/data`);
