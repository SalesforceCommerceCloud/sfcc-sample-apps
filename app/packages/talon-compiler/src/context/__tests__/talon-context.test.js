const path = require('path');
const TalonContext = require('../talon-context');
const { DEFAULT_OPTIONS } = require('test-talon-context');
const { stripPrefix } = require('../../utils/string');

const { templateDir } = DEFAULT_OPTIONS;

describe('talon-context', () => {
    it('prevents from reading unknown property', () => {
        expect(() => {
            return new TalonContext({ templateDir }).unknown;
        }).toThrow("Invalid context property: unknown");
    });

    it('uses default config', () => {
        const context = new TalonContext({ templateDir });

        // make paths relative so that snapshot does not vary
        const prefix = path.resolve(__dirname, '../..') + '/';
        const out = Object.entries(context).reduce((acc, [key, value]) => {
            acc[key] = stripPrefix(value, prefix);
            return acc;
        }, {});

        expect(out).toMatchSnapshot();
    });

    describe('ensures', () => {
        it('base path starts with /', () => {
            expect(() => {
                return new TalonContext({ templateDir, basePath: 'invalid path' });
            }).toThrow(`Base path does not start with a "/": invalid path`);
        });

        it('outputDir is specified', () => {
            expect(() => {
                return new TalonContext({ templateDir, outputDir: '' });
            }).toThrow(`outputDir must be specified`);
        });

        ['templateDir', 'srcDir', 'indexHtml', 'routesJson', 'themeJson'].forEach(option => {
            it(`${option} is specified`, () => {
                const config = { templateDir };
                config[option] = '';

                expect(() => {
                    return new TalonContext(config);
                }).toThrow(`${option} must be specified`);
            });

            it(`${option} exists`, () => {
                const config = { templateDir };
                config[option] = '/unknown';

                expect(() => {
                    return new TalonContext(config);
                }).toThrow(`${option} does not exist: /unknown`);
            });
        });
    });
});