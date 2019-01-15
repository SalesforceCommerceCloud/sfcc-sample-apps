import { createElement } from 'lwc';
import ShopButton from 'community_flashhelp/shopButton';

describe('community_flashhelp/shopButton', () => {
    beforeEach(() => {
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('renders correctly', () => {
        const element = createElement('community_flashhelp-shop-button', { is: ShopButton });
        document.body.appendChild(element);

        return Promise.resolve().then(() => {
            expect(element).toMatchSnapshot();
        });
    });
});
