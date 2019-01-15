import { createElement } from 'lwc';
import header from 'community_flashhelp/header';

describe('community_flashhelp/header', () => {
    beforeEach(() => {
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('renders correctly', () => {
        const element = createElement('community_flashhelp-header', { is: header });
        document.body.appendChild(element);

        return Promise.resolve().then(() => {
            expect(element).toMatchSnapshot();
        });
    });
});
