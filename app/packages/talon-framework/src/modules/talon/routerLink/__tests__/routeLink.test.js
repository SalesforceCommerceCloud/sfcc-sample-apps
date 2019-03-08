import { createElement } from 'lwc';
import RouterLink from 'talon/routerLink';

jest.mock('talon/routingService', () => ({
    getRouteUrl(route, routeParams, queryParams) {
        if (routeParams) {
            Object.entries(routeParams).forEach(([k, v]) => {
                route = route.replace(new RegExp(':' + k, 'g'), v);
            });
        }
        if (queryParams) {
            route += '?';
            Object.entries(queryParams).forEach(([k, v], idx) => {
                if (idx > 0) {
                    route += '&';
                }
                route += `${k}=${v}`;
            });
        }
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

    it('renders route params correctly', async () => {
        const element = createElement('talon-router-link', { is: RouterLink });
        element.label = 'Home';
        element.route = 'user/:userId';
        element.routeParams = {
            userId: '123',
            optional: '456'
        };

        document.body.appendChild(element);

        expect(element).toMatchSnapshot();
    });

    it('renders query params correctly', async () => {
        const element = createElement('talon-router-link', { is: RouterLink });
        element.label = 'Home';
        element.route = 'home';
        element.queryParams = {
            p1: '123',
            p2: '456'
        };

        document.body.appendChild(element);

        expect(element).toMatchSnapshot();
    });
});
