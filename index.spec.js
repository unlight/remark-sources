const { test } = require('zora');
const plugin = require('./index');
const remark = require('remark');
const { injector } = require('njct');

test('smoke', (t) => {
    t.ok(plugin);
    t.ok(typeof plugin === 'function');
    t.ok(plugin.name === 'remarkSources');
});

function process(markdown, options) {
    return remark().use(plugin, options).processSync(markdown).toString();
}

test('should find block', (t) => {
    let readFileMock = (path) => 'test content';
    injector.mock('readFileSync', () => readFileMock);
    const result = process('```js (index.js)\n```');
    t.ok(result === '```js (index.js)\ntest content\n```\n');
    injector.clear();
});

test('should find block with title', (t) => {
    let readFileMock = (path) => 'test content';
    injector.mock('readFileSync', () => readFileMock);
    const result = process('```js title="My Index" (index.js)\n```');
    t.ok(result === '```js title="My Index" (index.js)\ntest content\n```\n');
    injector.clear();
});

test('should skip block', (t) => {
    const result = process('```js\n```');
    t.equal(result, '```js\n\n```\n');
});

test('should skip block if format is invalid', (t) => {
    const result = process('```js {other.js}\n```');
    t.equal(result, '```js {other.js}\n\n```\n');
});
