import { createElement } from 'lwc';
import { mockQuery, reset } from '@lwce/apollo-client';
import Checkout from 'commerce/checkout';

import { registerWireService } from '@lwc/wire-service';
import { register } from 'lwc';
import { basketWithItem } from 'commerce/testData';
import { tick } from 'commerce/testHelpers';

registerWireService(register);

describe('<commerce-checkout>', function() {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }

        reset();
    });

    it('should render a loading page', async function() {
        const element = createElement('commerce-checkout', {
            is: Checkout,
        });

        document.body.appendChild(element);

        await tick();

        expect(element.shadowRoot.querySelector('.loading')).toMatchSnapshot();
    });

    it('should initially show the shipping stage', async function() {
        mockQuery(basketWithItem);

        const element = createElement('commerce-checkout', {
            is: Checkout,
        });

        document.body.appendChild(element);

        await tick();

        expect(
            element.shadowRoot.querySelector('commerce-checkout-shipping'),
        ).toMatchSnapshot();
    });
});
