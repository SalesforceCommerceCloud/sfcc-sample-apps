import { createElement } from 'lwc';
import heroLayout from 'community_flashhelp/heroLayout';

describe('community_flashhelp/heroLayout', () => {
    beforeEach(() => {
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('renders correctly', () => {
        const element = createElement('community_flashhelp-hero-layout', { is: heroLayout });
        document.body.appendChild(element);

        return Promise.resolve().then(() => {
            expect(element).toMatchSnapshot();
        });
    });
});