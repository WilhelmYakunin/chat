const { JSDOM } = require('jsdom');
const tsNode = require('ts-node');

tsNode.register({ project: './tsconfig.test.json' });

const jsDom = new JSDOM('<div></div>', { url: 'https://mock.org/' });

global.window = jsDom.window;
global.document = jsDom.window.document;
