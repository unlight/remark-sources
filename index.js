const visitChildren = require('unist-util-visit-children');
const fs = require('fs');
const { inject } = require('njct');

const defaultOptions = {};

const metaRe = new RegExp(/^[^\(]*\(([^\)]+)\)$/);

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
};

function readFile(meta) {
    if (!meta) {
        return undefined;
    }
    if (!(meta = (metaRe.exec(meta) || [])[1])) {
        return undefined;
    }
    const readFileSync = inject('readFileSync', () => fs.readFileSync);
    try {
        return readFileSync(meta, { encoding: 'utf8' });
    } catch (e) {
        throw new Error(`Failed to read file: ${meta}`);
    }
}
