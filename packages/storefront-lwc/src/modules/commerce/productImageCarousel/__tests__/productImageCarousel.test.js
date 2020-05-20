import { createElement } from 'lwc';
import ProductImageCarousel from 'commerce/productImageCarousel';

import { registerWireService } from '@lwc/wire-service';
import { register } from 'lwc';
import { tick } from 'commerce/testHelpers';

registerWireService(register);

describe('<commerce-product-image-carousel>', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('should render carousel', async () => {
        const element = createElement('commerce-product-image-carousel', {
            is: ProductImageCarousel,
        });
        element.images = mockImages;
        document.body.appendChild(element);

        await tick();

        // Initial carousel image
        expect(
            element.shadowRoot.querySelector('.carousel-item.active'),
        ).toMatchSnapshot();
    });

    it('should forward in the carousel', async () => {
        const element = createElement('commerce-product-image-carousel', {
            is: ProductImageCarousel,
        });
        element.images = mockImages;
        document.body.appendChild(element);

        await tick();

        // Initial carousel image
        expect(
            element.shadowRoot.querySelector('.carousel-item.active'),
        ).toMatchSnapshot();

        element.shadowRoot.querySelector('.carousel-control-next').click();

        await tick();

        // Next carousel image
        expect(
            element.shadowRoot.querySelector('.carousel-item.active'),
        ).toMatchSnapshot();

        element.shadowRoot.querySelector('.carousel-control-next').click();
        await tick();
        element.shadowRoot.querySelector('.carousel-control-next').click();
        await tick();

        // Back to the first carousel image
        expect(
            element.shadowRoot.querySelector('.carousel-item.active'),
        ).toMatchSnapshot();
    });

    it('should previous in the carousel', async () => {
        const element = createElement('commerce-product-image-carousel', {
            is: ProductImageCarousel,
        });
        element.images = mockImages;
        document.body.appendChild(element);

        await tick();

        // Initial carousel image
        expect(
            element.shadowRoot.querySelector('.carousel-item.active'),
        ).toMatchSnapshot();

        element.shadowRoot.querySelector('.carousel-control-prev').click();

        await tick();

        // Next carousel image
        expect(
            element.shadowRoot.querySelector('.carousel-item.active'),
        ).toMatchSnapshot();

        element.shadowRoot.querySelector('.carousel-control-prev').click();
        await tick();
        element.shadowRoot.querySelector('.carousel-control-prev').click();
        await tick();

        // Back to the first carousel image
        expect(
            element.shadowRoot.querySelector('.carousel-item.active'),
        ).toMatchSnapshot();
    });
});

const mockImages = [
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
];
