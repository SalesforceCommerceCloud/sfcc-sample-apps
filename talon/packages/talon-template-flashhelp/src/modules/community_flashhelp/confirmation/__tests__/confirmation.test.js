import { createElement } from 'lwc';
import Confirmation from 'community_flashhelp/confirmation';

describe('community_flashhelp/confirmation', () => {
    beforeEach(() => {
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('renders correctly', () => {
        const element = createElement('community_flashhelp-confirmation', { is: Confirmation });
        document.body.appendChild(element);

        return Promise.resolve().then(() => {
            expect(element).toMatchSnapshot();
        });
    });
});
