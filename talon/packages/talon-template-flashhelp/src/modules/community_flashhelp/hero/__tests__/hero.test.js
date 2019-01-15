import { createElement } from 'lwc';
import hero from 'community_flashhelp/hero';

describe('community_flashhelp/hero', () => {
    beforeEach(() => {
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('renders correctly', () => {
        const element = createElement('community_flashhelp-hero', { is: hero });
        document.body.appendChild(element);

        return Promise.resolve().then(() => {
            expect(element).toMatchSnapshot();
        });
    });
});
