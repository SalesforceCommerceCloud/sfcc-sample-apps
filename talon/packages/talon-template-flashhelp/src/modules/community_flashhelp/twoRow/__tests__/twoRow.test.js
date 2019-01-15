import { createElement } from 'lwc';
import twoRow from 'community_flashhelp/twoRow';

describe('community_flashhelp/twoRow', () => {
    beforeEach(() => {
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('renders correctly', () => {
        const element = createElement('community_flashhelp-two-row', { is: twoRow });
        document.body.appendChild(element);

        return Promise.resolve().then(() => {
            expect(element).toMatchSnapshot();
        });
    });
});