import {canAddToCart} from "../product.helper";
import {isType} from "graphql";
import {TestScheduler} from "jest";

describe("product helper", () => {
    it("should return false when the product is not yet loaded", () => {
        expect(canAddToCart(null)).toBe(false);
        expect(canAddToCart({})).toBe(false);
    });

    it("should return false when the product is a master sku (no variant selected)", () => {
        expect(canAddToCart(
            {
                type: {
                    master: true
                }
            },
            1
        )).toBe(false);
    });

    it("should return true when the product is orderable and available", () => {
        expect(canAddToCart(
            {
                type: {
                    master: false
                },
                inventory: {
                    orderable: true,
                    ats: 1
                }
            },
            1
        )).toBe(true);
    });

    it("should return false when the product is unorderable", () => {
        expect(canAddToCart(
            {
                type: {
                    master: false
                },
                inventory: {
                    orderable: false,
                    ats: 1
                }
            },
            1
        )).toBe(false);
    });

    it("should return false when the product is orderable and with unavailable quantity", () => {
        expect(canAddToCart(
            {
                type: {
                    master: false
                },
                inventory: {
                    orderable: false,
                    ats: 1
                }
            },
            2
        )).toBe(false);
    });

    it("should return true when the product is backorderable and with unavailable quantity", () => {
        expect(canAddToCart(
            {
                type: {
                    master: false
                },
                inventory: {
                    orderable: false,
                    backorderable: true,
                    ats: 1
                }
            },
            2
        )).toBe(true);
    });

    it("should return true when the product is preorderable and with unavailable quantity", () => {
        expect(canAddToCart(
            {
                type: {
                    master: false
                },
                inventory: {
                    orderable: false,
                    preorderable: true,
                    ats: 1
                }
            },
            2
        )).toBe(true);
    });
});
