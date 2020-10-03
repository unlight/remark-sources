const visit = require('unist-util-visit');
const fs = require('fs');
const { inject } = require('njct');

const defaultOptions = {};

const metaRe = new RegExp(/^[^\(]*\(([^\)]+)\)$/);

module.exports = function remarkSources(options = {}) {
    options = { ...defaultOptions, ...options };
    return (root) => {
        visit(root, 'code', function (node) {
            const content = readFile(node.meta);
            if (content !== undefined) {
                node.value = content;
            }
        });
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
