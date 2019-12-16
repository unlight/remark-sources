const visitChildren = require('unist-util-visit-children')
const fs = require('fs');
const child_process = require('child_process');
const { inject } = require('njct');

const defaultOptions = {
};

module.exports = function remarkSources(options = {}) {
    options = { ...defaultOptions, ...options };
    return (root) => {
        visitChildren((node, index, parent) => {
            if (node && node.type === 'code') {
                const content = readFile(node.meta);
                if (content !== undefined) {
                    node.value = content;
                }
            }
        })(root);
    };
}

function readFile(meta) {
    if (!meta) {
        return undefined;
    }
    if (meta[0] === '(' && meta[meta.length - 1] === ')') {
        meta = meta.slice(1, -1);
    }
    const readFileSync = inject('readFileSync', () => fs.readFileSync);
    try {
        return readFileSync(meta, { encoding: 'utf8' });
    } catch (e) {
        throw new Error(`Failed to read file: ${meta}`);
    }
}
