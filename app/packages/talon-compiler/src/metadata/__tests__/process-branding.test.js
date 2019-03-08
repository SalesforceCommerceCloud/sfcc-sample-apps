import { getCanonicalBrandingProperty, getBrandingPropertyValue } from '../process-branding';

describe('process-branding', () => {
    describe('setCanonicalBrandingPropertyValue', () => {
        it('returns identical branding property', () => {
            const prop = {
                name: 'propName',
                value: 'propValue',
                nonCanonical: 'ignored',
                type: 'propType'
            };

            expect(getCanonicalBrandingProperty(prop)).toEqual({
                name: 'propName',
                value: 'propValue',
                nonCanonical: 'ignored',
                type: 'propType'
            });
        });

        it('sets value if type Picklist', () => {
            const prop = {
                name: 'propName',
                value: 'labelA:valueA',
                type: 'Picklist'
            };

            expect(getCanonicalBrandingProperty(prop)).toEqual({
                name: 'propName',
                value: 'valueA',
                type: 'Picklist'
            });
        });

        it('sets value if type Picklist with default', () => {
            const prop = {
                name: 'propName',
                value: 'labelA:valueA,labelB:valueB:default,labelC:valueC',
                type: 'Picklist'
            };

            expect(getCanonicalBrandingProperty(prop)).toEqual({
                name: 'propName',
                value: 'valueB',
                type: 'Picklist'
            });
        });

        it('sets value if type Picklist without default', () => {
            const prop = {
                name: 'propName',
                value: 'labelA:valueA,labelB:valueB,labelC:valueC',
                type: 'Picklist'
            };

            expect(getCanonicalBrandingProperty(prop)).toEqual({
                name: 'propName',
                value: 'valueA',
                type: 'Picklist'
            });
        });

        it('sets value undefined for malformed Picklist', () => {
            const prop = {
                name: 'propName',
                value: 'labelA,labelB',
                type: 'Picklist'
            };

            expect(getCanonicalBrandingProperty(prop)).toEqual({
                name: 'propName',
                value: undefined,
                type: 'Picklist'
            });
        });
    });

    describe('getBrandingPropertyValue', () => {
        it('returns branding property value', () => {
            const prop = {
                name: 'propName',
                value: 'propValue',
            };

            expect(getBrandingPropertyValue(prop)).toBe('propValue');
        });

        it('ignores unknown types', () => {
            const prop = {
                name: 'propName',
                value: '/some/image/url.jpg',
                type: 'BOGUS'
            };

            expect(getBrandingPropertyValue(prop)).toBe('/some/image/url.jpg');
        });

        it('processes values of type Image', () => {
            const prop = {
                name: 'propName',
                value: '/some/image/url.jpg',
                type: 'Image'
            };

            expect(getBrandingPropertyValue(prop)).toBe('url(/some/image/url.jpg)');
        });
    });
});