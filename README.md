# remark-sources

Inject source code to markdown files.

## Install

```sh
npm install --save-dev remark-sources
```

## Usage

````js
const remark = require('remark');
const sources = require('remark-sources');
const input = '```js (index.js)\n```'; // (path to file in round brackets)
const options = {};
const output = remark().use(sources, options).processSync(input).toString();
````

Output:

```ts
// this is index.js content
```

## Options

```js
const defaultOptions = {};
```
