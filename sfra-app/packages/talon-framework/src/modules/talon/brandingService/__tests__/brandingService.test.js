import { style, setBrandingProperties } from "talon/brandingService";

beforeEach(() => {
    setBrandingProperties({});
});

describe('talon/brandingService', () => {
    describe('style', () => {
        it('outputs the css variable declaration when properly declared', () => {
            setBrandingProperties({"--foo-bar": "red"});
            return expect(style('--foo-bar')).toBe('red');
        });

        it('outputs whatever you give it inside a var declaration', () => {
            setBrandingProperties({"fooBar": "red"});
            expect(style('fooBar')).toBe('red');
        });

        it('handles default values for unknown properties', () => {
            expect(style('--foo-bar', 'red')).toBe('red');
        });

        it('outputs proper var format with unknown property', () => {
            expect(style('--foo-BOGUS')).toBe('var(--foo-BOGUS)');
            expect(style('--foo-BOGUS', null)).toBe('var(--foo-BOGUS)');
            expect(style('--foo-BOGUS', undefined)).toBe('var(--foo-BOGUS)');
        });

        it('doesnt return default values for known properties', () => {
            setBrandingProperties({"--foo-bar": "blue"});
            expect(style('--foo-bar', 'red')).toBe('blue');
        });
    });
});