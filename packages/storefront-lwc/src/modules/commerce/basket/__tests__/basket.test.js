import Basket from 'commerce/basket';
import { mockQuery, reset } from '@lwce/apollo-client';
import { createElement } from 'lwc';

import { tick } from 'commerce/testHelpers';
import { emptyBasketResponse, basketWithItem } from 'commerce/testData';

describe('<commerce-basket>', function() {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }

        reset();
    });

    it('should render basket loading', async function() {
        const element = createElement('commerce-basket', {
            is: Basket,
        });

        document.body.appendChild(element);

        await tick();

        expect(element.shadowRoot.querySelector('.loading')).toMatchSnapshot();
    });

    it('should render an empty basket', async function() {
        mockQuery(emptyBasketResponse);

        const element = createElement('commerce-basket', {
            is: Basket,
        });

        document.body.appendChild(element);

        await tick();

        expect(
            element.shadowRoot.querySelector('.text-empty-basket'),
        ).toMatchSnapshot();
    });

    it('should render a basket with an item', async function() {
        mockQuery(basketWithItem);

        const element = createElement('commerce-basket', {
            is: Basket,
        });

        document.body.appendChild(element);

        await tick();

        expect(
            element.shadowRoot.querySelector('.header-title .number-of-items'),
        ).toMatchSnapshot();
    });

    it('should update basket details', async function() {
        mockQuery(basketWithItem);

        const element = createElement('commerce-basket', {
            is: Basket,
        });

        document.body.appendChild(element);

        await tick();

        element.shadowRoot
            .querySelector('commerce-shippingmethods')
            .dispatchEvent(
                new CustomEvent('updateshippingmethod', {
                    detail: {
                        updatedBasket: {
                            ...basketWithItem.data.getBasket,
                            totalProductsQuantity: 2,
                        },
                    },
                }),
            );

        await tick();

        expect(
            element.shadowRoot.querySelector('.header-title .number-of-items'),
        ).toMatchSnapshot();
    });
});
