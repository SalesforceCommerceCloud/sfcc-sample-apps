import { assert, autoBind, getQueryStringParameterByName, getQueryStringParameters, mapToQueryString } from "talon/utils";

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

    describe('getQueryStringParameters', () => {
        it('returns parameter values', () => {
            expect(getQueryStringParameters('?p1=abc&p2=123&p3=,.[')).toEqual({
                p1: 'abc',
                p2: '123',
                p3: ',.[',
            });
        });
        it('returns parameter values without leading ?', () => {
            expect(getQueryStringParameters('p1=abc&p2=123&p3=,.[')).toEqual({
                p1: 'abc',
                p2: '123',
                p3: ',.[',
            });
        });
        it('defaults search string to window.location.search', () => {
            try {
                // set window.location.search value
                window.history.replaceState(null, null, '?p1=abc');

                expect(getQueryStringParameters()).toEqual({ p1: 'abc' });
            } finally {
                // remove URL param to prevent side effects
                window.history.replaceState(null, null, '?');
            }
        });
        it('decodes parameter values', () => {
            expect(getQueryStringParameters('?p1=a+%40')).toEqual({ p1: 'a @' });
        });
        it('removes empty parameters', () => {
            expect(getQueryStringParameters('?p1=abc&&&')).toEqual({ p1: 'abc' });
        });
        it('uses the final duplicate param', () => {
            expect(getQueryStringParameters('?p1=abc&p1=123&p1=,.[')).toEqual({ p1: ',.[' });
        });
        it('gets value after the first =', () => {
            expect(getQueryStringParameters('?p1=abc=def=ghi')).toEqual({ p1: 'abc=def=ghi' });
        });
        it('gets empty string values', () => {
            expect(getQueryStringParameters('?p1=&p2=')).toEqual({ p1: '', p2: '' });
        });
        it('gets empty string value if no = specified', () => {
            expect(getQueryStringParameters('?p1&p2')).toEqual({ p1: '', p2: '' });
        });
    });

    describe('mapToQueryString', () => {
        it('returns query string with single param', () => {
            expect(mapToQueryString({ 'a' : 'hello' })).toEqual('a=hello');
        });
        it('returns query string with multiple param', () => {
            expect(mapToQueryString({
                'a' : 'hello',
                'b' : 123456,
                'c' : null,
                'd' : ''
            })).toEqual('a=hello&b=123456&c=null&d=');
        });
        it('returns empty query string with empty map', () => {
            expect(mapToQueryString({})).toEqual('');
        });
        it('encodes params by default', () => {
            expect(mapToQueryString({ 'a' : 'b +' })).toEqual('a=b%20%2B');
        });
        it('does not re-encode encoded params', () => {
            expect(mapToQueryString({ 'a' : 'b%20%2B' })).toEqual('a=b%20%2B');
        });
        it('does not encode params', () => {
            expect(mapToQueryString({ 'a' : 'b +' }, false)).toEqual('a=b +');
        });
    });
});

