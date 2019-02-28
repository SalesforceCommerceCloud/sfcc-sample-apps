import { createElement } from 'lwc';
import RouterLink from 'talon/routerLink';

jest.mock('talon/routingService', () => ({
    getRouteUrl(route) {
        return `/${route}`;
    }
}));

describe('talon/routerLink', () => {
    beforeEach(() => {
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('renders correctly', async () => {
        const element = createElement('talon-router-link', { is: RouterLink });
        element.label = 'Home';
        element.route = 'home';

        document.body.appendChild(element);

        expect(element).toMatchSnapshot();
    });
});
