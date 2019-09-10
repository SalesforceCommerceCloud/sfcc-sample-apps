'use strict';

const minimatch = require('minimatch');
const { docUrl } = require('../util/doc-url');

// regular expression for inline configs that disable rules
const REGEXP_LINE = /^\s*(eslint-disable(?:-next)?-line)\s*(.*)$/;

module.exports = {
    meta: {
        docs: {
            description: 'disallow inline disablement of ESLint rule',
            category: 'LWC',
            recommended: true,
            url: docUrl('no-inline-disable'),
        },

        schema: [
            {
                type: 'object',
                properties: {
                    whitelist: {
                        type: 'object',
                        patternProperties: {
                            '^.*$': {
                                type: 'array',
                                items: {
                                    type: 'string',
                                },
                            },
                        },
                        additionalProperties: false,
                        additionalItems: false,
                        uniqueItems: true,
                    },
                },
                additionalProperties: false,
            },
        ],
    },

    create(context) {
        const sourceCode = context.getSourceCode();
        const whitelist = context.options[0] ? context.options[0].whitelist : null;

        function isWhitelisted(rule) {
            if (!whitelist) {
                return false;
            }
            const paths = whitelist[rule];
            if (paths) {
                const filename = context.getFilename();
                for (const path of paths) {
                    if (minimatch(filename, path)) {
                        // glob pattern matching
                        return true;
                    }
                }
            }
            return false;
        }

        function patchLocation(loc) {
            // NOTE: without this sometimes context.report() doesn't report the error
            return {
                start: {
                    line: loc.start.line,
                    column: -1,
                },
                end: loc.end,
            };
        }

        return {
            Program() {
                for (const comment of sourceCode.getAllComments()) {
                    if (comment.type !== 'Line') {
                        continue;
                    }

                    const match = REGEXP_LINE.exec(comment.value);
                    if (!match || !match[2]) {
                        continue;
                    }

                    let rules = match[2].trim();
                    if (rules.length > 0) {
                        for (let rule of rules.split(',')) {
                            rule = rule.trim();
                            if (!isWhitelisted(rule)) {
                                context.report({
                                    loc: patchLocation(comment.loc),
                                    message: 'Inline rule disablement not allowed: ' + rule,
                                });
                            }
                        }
                    }
                }
            },
        };
    },
};
