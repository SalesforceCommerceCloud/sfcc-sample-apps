import { createElement } from 'lwc';
import ErrorCmp from 'community_flashhelp/error';

describe('community_flashhelp/error', () => {
    beforeEach(() => {
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('renders correctly', () => {
        const element = createElement('community_flashhelp-error', { is: ErrorCmp });
        document.body.appendChild(element);

        return Promise.resolve().then(() => {
            expect(element).toMatchSnapshot();
        });
    });
});
