import { elementNameToModuleSpecifier, moduleSpecifierToElementName } from '../naming-utils';

describe('naming-utils', () => {
    describe('elementNameToModuleSpecifier', () => {
        it('converts element name', () => {
            expect(elementNameToModuleSpecifier('a-b')).toBe('a/b');
        });

        it('converts element name to camel case', () => {
            expect(elementNameToModuleSpecifier('a-bbb-ccc')).toBe('a/bbbCcc');
        });

        it('throws with an invalid element name', () => {
            expect(() => {
                elementNameToModuleSpecifier('123');
            }).toThrowError('123 is an invalid element name.');
        });

        it('leaves module specifier unchanged', () => {
            expect(elementNameToModuleSpecifier('a/bbbCcc')).toBe('a/bbbCcc');
        });
    });

    describe('moduleSpecifierToElementName', () => {
        it('converts module specifier basic', () => {
            expect(moduleSpecifierToElementName('a/b')).toBe('a-b');
        });

        it('converts module specifier advanced', () => {
            expect(moduleSpecifierToElementName('applesAndOranges/birdsAndTheBees')).toBe('apples-and-oranges-birds-and-the-bees');
        });

        it('leaves snake case alone', () => {
            expect(moduleSpecifierToElementName('apples_oranges_bananas/fruitSalad')).toBe('apples_oranges_bananas-fruit-salad');
        });

        it('throws when no module name or namespace provided', () => {
            expect(() => {
                moduleSpecifierToElementName('fruitSalad');
            }).toThrowError('fruitSalad is an invalid module specifier.');
        });

        it('leaves module specifier unchanged', () => {
            expect(moduleSpecifierToElementName('apples-oranges-bananas')).toBe('apples-oranges-bananas');
        });
    });
});