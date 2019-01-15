import { createElement } from 'lwc';
import threeRow from 'community_flashhelp/threeRow';

describe('community_flashhelp/threeRow', () => {
    beforeEach(() => {
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('renders correctly', () => {
        const element = createElement('community_flashhelp-three-row', { is: threeRow });
        document.body.appendChild(element);

        return Promise.resolve().then(() => {
            expect(element).toMatchSnapshot();
        });
    });
});