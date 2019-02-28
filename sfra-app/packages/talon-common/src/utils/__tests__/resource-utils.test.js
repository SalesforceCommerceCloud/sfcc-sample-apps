import { getResourceUrl, parseUrl, resourceDescriptorToString } from '../resource-utils';

describe('resource-utils', () => {
    describe('getResourceUrl', () => {
        describe('by config', () => {
            it(`throws if type is not specified`, () => {
                expect(() => {
                    getResourceUrl({ name: 'name' }, 'dev');
                }).toThrow("Type not specified");
            });
            it(`throws if name is not specified`, () => {
                expect(() => {
                    getResourceUrl({ type: 'type' }, 'dev');
                }).toThrow("Name not specified");
            });
            it(`throws if mode is not specified`, () => {
                expect(() => {
                    getResourceUrl({ type: 'type', name: 'name' });
                }).toThrow("Mode not specified");
            });
            it(`throws if component locale is not specified`, () => {
                expect(() => {
                    getResourceUrl({ type: 'component', name: 'name' }, 'dev');
                }).toThrow("Component locale not specified");
            });
            it(`throws if mode is invalid`, () => {
                expect(() => {
                    getResourceUrl({ type: 'type', name: 'name' }, 'invalid_mode');
                }).toThrow("Invalid mode: invalid_mode");
            });
            it(`returns url`, () => {
                expect(getResourceUrl({ type: 'type', name: 'name' }, 'dev', 'uid'))
                    .toBe('/talon/type/uid/dev/name.js');
            });
            it(`includes default UID when UID not specified`, () => {
                expect(getResourceUrl({ type: 'type', name: 'name' }, 'dev'))
                    .toBe('/talon/type/latest/dev/name.js');
            });
            it(`includes locale when specified`, () => {
                expect(getResourceUrl({ type: 'type', name: 'name', locale: 'locale' }, 'dev'))
                    .toBe('/talon/type/latest/dev/locale/name.js');
            });
            it(`includes uid and locale when specified`, () => {
                expect(getResourceUrl({ type: 'type', name: 'name', locale: 'locale' }, 'dev', 'uid'))
                    .toBe('/talon/type/uid/dev/locale/name.js');
            });
        });

        describe('by resource descriptor', () => {
            it(`throws if type is not specified`, () => {
                expect(() => {
                    getResourceUrl('://name', 'dev');
                }).toThrow("Type not specified");
            });
            it(`throws if name is not specified`, () => {
                expect(() => {
                    getResourceUrl('type://', 'dev');
                }).toThrow("Name not specified");
            });
            it(`throws if mode is not specified`, () => {
                expect(() => {
                    getResourceUrl('type://name');
                }).toThrow("Mode not specified");
            });
            it(`throws if component locale is not specified`, () => {
                expect(() => {
                    getResourceUrl('component://name', 'dev');
                }).toThrow("Component locale not specified");
            });
            it(`throws if mode is invalid`, () => {
                expect(() => {
                    getResourceUrl('type://name', 'invalid_mode');
                }).toThrow("Invalid mode: invalid_mode");
            });
            it(`returns url`, () => {
                expect(getResourceUrl('type://name', 'dev'))
                    .toBe('/talon/type/latest/dev/name.js');
            });
            it(`includes uid when specified`, () => {
                expect(getResourceUrl('type://name', 'dev', 'uid'))
                    .toBe('/talon/type/uid/dev/name.js');
            });
            it(`includes locale when specified`, () => {
                expect(getResourceUrl('type://name@locale', 'dev'))
                    .toBe('/talon/type/latest/dev/locale/name.js');
            });
            it(`includes uid and locale when specified`, () => {
                expect(getResourceUrl('type://name@locale', 'dev', 'uid'))
                    .toBe('/talon/type/uid/dev/locale/name.js');
            });
        });
    });
    describe('parseUrl', () => {
        it(`parse component url`, () => {
            const url = '/talon/component/f13235e170/prod/en_US/community_flashhelp/home.js';
            expect(parseUrl(url))
                .toEqual({
                    type: 'component',
                    name: 'community_flashhelp/home',
                    locale: 'en_US',
                    mode: 'prod',
                    uid: 'f13235e170'
                });
        });
        it(`parse component url without UID`, () => {
            const url = '/talon/component/latest/dev/en_US/community_flashhelp/about.js';
            expect(parseUrl(url))
                .toEqual({
                    type: 'component',
                    name: 'community_flashhelp/about',
                    locale: 'en_US',
                    mode: 'dev'
                });
        });
        it(`parse framework url`, () => {
            const url = '/talon/framework/913d24b777/dev/talon.js';
            expect(parseUrl(url))
                .toEqual({
                    type: 'framework',
                    name: 'talon',
                    mode: 'dev',
                    uid: '913d24b777'
                });
        });
        it(`throws if url is invalid`, () => {
            const url = '/talon/framework/913d24b777/dev/invalid/talon.js';
            expect(() => {
                parseUrl(url);
            }).toThrow(`Invalid url: ${url}`);
        });
        it(`throws if url does not start with a /`, () => {
            const url = 'talon/component/f13235e170/prod/en_US/community_flashhelp/home.js';
            expect(() => {
                parseUrl(url);
            }).toThrow(`URL must start with a '/': ${url}`);
        });
        it(`throws if prefix is unknown`, () => {
            const url = '/unknown/component/f13235e170/prod/en_US/community_flashhelp/home.js';
            expect(() => {
                parseUrl(url);
            }).toThrow(`Invalid prefix unknown: ${url}`);
        });
        it(`throws if extension is unknown`, () => {
            const url = '/talon/component/f13235e170/prod/en_US/community_flashhelp/home.json';
            expect(() => {
                parseUrl(url);
            }).toThrow(`Invalid extension json: ${url}`);
        });
        it(`throws if mode is missing`, () => {
            const url = '/talon/framework/latest/talon.js';
            expect(() => {
                parseUrl(url);
            }).toThrow(`URL must include the mode: ${url}`);
        });
        it(`throws if uid is missing`, () => {
            const url = '/talon/framework/talon.js';
            expect(() => {
                parseUrl(url);
            }).toThrow(`URL must include the UID: ${url}`);
        });
        it(`throws if locale is missing in component URL`, () => {
            const url = '/talon/component/f13235e170/prod/community_flashhelp/home.js';
            expect(() => {
                parseUrl(url);
            }).toThrow(`Component URL must include the locale: ${url}`);
        });
        it(`throws if mode is invalid`, () => {
            const url = '/talon/component/f13235e170/unknown_mode/en_US/community_flashhelp/home.js';
            expect(() => {
                parseUrl(url);
            }).toThrow(`Invalid mode unknown_mode: ${url}`);
        });
    });
    describe('resourceDescriptorToString', () => {
        it('returns resource descriptor as a string', () => {
            expect(resourceDescriptorToString({ type: 'type', name: 'name'})).toBe('type://name');
        });
        it('includes locale', () => {
            expect(resourceDescriptorToString({ type: 'type', name: 'name', locale: 'locale'})).toBe('type://name@locale');
        });
        it('return component resource descriptor as a string', () => {
            expect(resourceDescriptorToString({ type: 'component', name: 'x/myComponent', locale: 'en_US'})).toBe('component://x/myComponent@en_US');
        });
        it('throws when type not specified', () => {
            expect(() => {
                resourceDescriptorToString({ name: 'name'});
            }).toThrow();
        });
        it('throws when name not specified', () => {
            expect(() => {
                resourceDescriptorToString({ name: 'name'});
            }).toThrow();
        });
        it('throws when component locale not specified', () => {
            expect(() => {
                resourceDescriptorToString({ type: 'component', name: 'name'});
            }).toThrow();
        });
    });
});
