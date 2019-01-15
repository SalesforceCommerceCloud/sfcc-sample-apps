import { createElement } from 'lwc';
import Form from 'community_flashhelp/form';

jest.mock("talon/routingService", () => {
    return {
        navigateToRoute: jest.fn()
    };
});

global.fetch = jest.fn();

describe('community_flashhelp/form', () => {
    beforeEach(() => {
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }

        jest.resetAllMocks();

        fetch.mockReturnValue(Promise.resolve());
    });

    it('renders correctly', () => {
        const element = createElement('community_flashhelp-form', { is: Form });
        document.body.appendChild(element);

        return Promise.resolve().then(() => {
            expect(element).toMatchSnapshot();
        });
    });
});
