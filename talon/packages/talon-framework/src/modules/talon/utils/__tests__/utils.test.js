import { assert, autoBind, getQueryStringParameterByName } from "talon/utils";

class A {
    i = 1;
    constructor() {
        autoBind(this);
    }
    test1() {
        return this.i;
    }
    test2() {
        return this.i;
    }
}

describe('talon/utils', () => {
    describe('assert', () => {
        it('throws if assertion is not verified', () => {
            expect(() => {
                assert(false);
            }).toThrow();
        });
        it('does not throw if assertion is verified', () => {
            expect(() => {
                assert(true);
            }).not.toThrow();
        });
    });

    describe('autoBind', () => {
        it('binds all methods to instance', () => {
            const a = new A();
            const { test1, test2 } = a;
            expect(test1()).toBe(1);
            expect(test2()).toBe(1);
        });
    });

    describe('getQueryStringParameterByName', () => {
        it('returns parameter value', () => {
            expect(getQueryStringParameterByName('p1', '?p1=abc')).toBe('abc');
        });
        it('defaults search string to window.location.search', () => {
            try {
                // set window.location.search value
                window.history.replaceState(null, null, '?p1=abc');

                expect(getQueryStringParameterByName('p1')).toBe('abc');
            } finally {
                // remove URL param to prevent side effects
                window.history.replaceState(null, null, '?');
            }
        });
        it('decodes parameter value', () => {
            expect(getQueryStringParameterByName('p1', '?p1=a+%40')).toBe('a @');
        });
        it('returns null for parameters not present', () => {
            expect(getQueryStringParameterByName('p2', '?p1=abc')).toBeNull();
        });
    });
});

