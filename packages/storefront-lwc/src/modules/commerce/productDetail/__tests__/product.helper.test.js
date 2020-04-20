import { canAddToBasket } from '../product.helper';

describe('product helper', () => {
    it('should return false when the product is not yet loaded', () => {
        expect(canAddToBasket(null)).toBe(false);
        expect(canAddToBasket({})).toBe(false);
    });

    it('should return false when the product is a master sku (no variant selected)', () => {
        expect(
            canAddToBasket(
                {
                    type: {
                        master: true,
                    },
                },
                1,
            ),
        ).toBe(false);
    });

    it('should return true when the product is orderable and available', () => {
        expect(
            canAddToBasket(
                {
                    type: {
                        master: false,
                    },
                    inventory: {
                        orderable: true,
                        ats: 1,
                    },
                },
                1,
            ),
        ).toBe(true);
    });

    it('should return false when the product is unorderable', () => {
        expect(
            canAddToBasket(
                {
                    type: {
                        master: false,
                    },
                    inventory: {
                        orderable: false,
                        ats: 1,
                    },
                },
                1,
            ),
        ).toBe(false);
    });

    it('should return false when the product is orderable and with unavailable quantity', () => {
        expect(
            canAddToBasket(
                {
                    type: {
                        master: false,
                    },
                    inventory: {
                        orderable: false,
                        ats: 1,
                    },
                },
                2,
            ),
        ).toBe(false);
    });

    it('should return true when the product is backorderable and with unavailable quantity', () => {
        expect(
            canAddToBasket(
                {
                    type: {
                        master: false,
                    },
                    inventory: {
                        orderable: false,
                        backorderable: true,
                        ats: 1,
                    },
                },
                2,
            ),
        ).toBe(true);
    });

    it('should return true when the product is preorderable and with unavailable quantity', () => {
        expect(
            canAddToBasket(
                {
                    type: {
                        master: false,
                    },
                    inventory: {
                        orderable: false,
                        preorderable: true,
                        ats: 1,
                    },
                },
                2,
            ),
        ).toBe(true);
    });
});
