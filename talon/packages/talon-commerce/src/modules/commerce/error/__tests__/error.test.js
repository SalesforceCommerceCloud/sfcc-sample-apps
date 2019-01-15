import { createElement } from 'lwc';
import ErrorCmp from 'commerce/error';

describe('commerce/error', () => {
    beforeEach(() => {
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('renders correctly', () => {
        const element = createElement('commerce-error', { is: ErrorCmp });
        document.body.appendChild(element);

        return Promise.resolve().then(() => {
            expect(element).toMatchSnapshot();
        });
    });
});
