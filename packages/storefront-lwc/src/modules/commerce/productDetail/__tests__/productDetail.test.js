import { createElement } from 'lwc';
import {
    mockQuery,
    mockMutation,
    reset,
    getLastMutation,
} from '@lwce/apollo-client';
import ProductDetail from 'commerce/productDetail';
import { tick } from 'commerce/testHelpers';

describe('<commerce-product-detail>', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }

        reset();
    });

    it('should render the product name and item number', async () => {
        mockQuery({
            product: mockProduct,
        });
        const element = createElement('commerce-product-detail', {
            is: ProductDetail,
        });
        document.body.appendChild(element);

        await tick();

        expect(
            element.shadowRoot.querySelector('.d-md-none .col .float-left'),
        ).toMatchSnapshot();

        expect(
            element.shadowRoot.querySelector('.d-md-none .small-paragraph'),
        ).toMatchSnapshot();
    });

    it('should not add to basket when not ready', async () => {
        mockQuery({
            product: mockProduct,
        });
        const element = createElement('commerce-product-detail', {
            is: ProductDetail,
        });
        document.body.appendChild(element);

        await tick();

        expect(
            element.shadowRoot
                .querySelector('.btn-primary')
                .getAttribute('disabled'),
        ).toBe(''); // an empty string means it is present
    });

    it('should be able to add to basket', async () => {
        mockQuery({
            product: {
                ...mockProduct,
                type: {
                    ...mockProduct.type,
                    master: false,
                },
            },
        });
        const element = createElement('commerce-product-detail', {
            is: ProductDetail,
        });
        document.body.appendChild(element);

        await tick();

        element.shadowRoot.querySelector('commerce-variations').dispatchEvent(
            new CustomEvent('updateproduct', {
                detail: {
                    allVariationsSelected: true,
                    hasColor: true,
                    hasSize: false,
                    qty: 2,
                    selectedColor: 'NAVYSI',
                    selectedSize: '-',
                },
            }),
        );

        await tick();

        expect(
            element.shadowRoot
                .querySelector('.btn-primary')
                .getAttribute('disabled'),
        ).toBe(null); // null means the disabled attribute is not present
    });

    it('should add to basket', async () => {
        mockQuery({
            product: {
                ...mockProduct,
                type: {
                    ...mockProduct.type,
                    master: false,
                },
            },
        });
        mockMutation({
            addProductToBasket: {},
        });

        const element = createElement('commerce-product-detail', {
            is: ProductDetail,
        });
        document.body.appendChild(element);

        await tick();

        element.shadowRoot.querySelector('commerce-variations').dispatchEvent(
            new CustomEvent('updateproduct', {
                detail: {
                    allVariationsSelected: true,
                    hasColor: true,
                    hasSize: false,
                    qty: 2,
                    selectedColor: 'NAVYSI',
                    selectedSize: '-',
                },
            }),
        );

        await tick();

        element.shadowRoot.querySelector('.btn-primary').click();

        await tick();

        expect(getLastMutation()).toStrictEqual({
            variables: {
                productId: '682875719029M',
                quantity: 2,
            },
        });
    });
});

const mockProduct = {
    name: 'Checked Silk Tie',
    id: '25752235M',
    masterId: '25752235M',
    longDescription: 'description long',
    shortDescription: 'description short',
    currency: 'USD',
    price: 29.99,
    prices: {
        sale: 29.99,
        list: null,
        __typename: 'Prices',
    },
    image: '',
    images: [
        {
            title: 'Checked Silk Tie, ',
            alt: 'Checked Silk Tie, , large',
            link: 'https://image-1.jpg',
            __typename: 'Image',
        },
        {
            title: 'Checked Silk Tie, ',
            alt: 'Checked Silk Tie, , large',
            link: 'https://image-2.jpg',
            __typename: 'Image',
        },
        {
            title: 'Checked Silk Tie, Navy',
            alt: 'Checked Silk Tie, Navy, large',
            link: 'https://image-3.jpg',
            __typename: 'Image',
        },
    ],
    variants: [
        {
            id: '682875090845M',
            variationValues: [
                {
                    key: 'color',
                    value: 'COBATSI',
                    __typename: 'VariationValue',
                },
            ],
            __typename: 'Variant',
        },
        {
            id: '682875719029M',
            variationValues: [
                {
                    key: 'color',
                    value: 'NAVYSI',
                    __typename: 'VariationValue',
                },
            ],
            __typename: 'Variant',
        },
        {
            id: '682875540326M',
            variationValues: [
                {
                    key: 'color',
                    value: 'YELLOSI',
                    __typename: 'VariationValue',
                },
            ],
            __typename: 'Variant',
        },
    ],
    variationAttributes: [
        {
            variationAttributeType: {
                id: 'color',
                name: 'Color',
                __typename: 'VariationAttributeType',
            },
            variationAttributeValues: [
                {
                    name: 'Cobalt',
                    value: 'COBATSI',
                    orderable: true,
                    swatchImage: {
                        link: 'https://link-1.jpg',
                        style: 'background: url(https://link-1.jpg);',
                        __typename: 'Image',
                    },
                    __typename: 'VariationAttributeValues',
                },
                {
                    name: 'Navy',
                    value: 'NAVYSI',
                    orderable: true,
                    swatchImage: {
                        link: 'https://link-2.jpg',
                        style: 'background: url(https://link-2.jpg);',
                        __typename: 'Image',
                    },
                    __typename: 'VariationAttributeValues',
                },
                {
                    name: 'Yellow',
                    value: 'YELLOSI',
                    orderable: true,
                    swatchImage: {
                        link: 'https://link-3.jpg',
                        style: 'background: url(https://link-3.jpg);',
                        __typename: 'Image',
                    },
                    __typename: 'VariationAttributeValues',
                },
            ],
            __typename: 'VariationAttribute',
        },
    ],
    inventory: {
        ats: 300,
        backorderable: false,
        id: 'inventory_m',
        orderable: true,
        preorderable: false,
        stockLevel: 300,
        __typename: 'Inventory',
    },
    type: {
        bundle: null,
        item: null,
        master: true,
        option: null,
        set: null,
        variant: null,
        variationGroup: null,
        __typename: 'ProductType',
    },
    productPromotions: null,
    __typename: 'Product',
};
