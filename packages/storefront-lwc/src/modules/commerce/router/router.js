import UniversalRouter from 'universal-router';
import { createBrowserHistory } from 'history';
import xss from 'xss';

const history = createBrowserHistory();
const router = new UniversalRouter(
    [
        {
            path: '',
            action: () => ({ element: 'commerce-home' }),
        },
        {
            path: '/search/:query',
            action: location => ({
                element: 'commerce-product-search-results',
                attributes: { query: xss(location.params.query) },
            }),
        },
        {
            path: '/basket',
            action: () => ({ element: 'commerce-basket' }),
        },
        {
            path: '/product/:pid',
            action: location => ({
                element: 'commerce-product-detail',
                attributes: { pid: xss(location.params.pid) },
            }),
        },
    ],
    {
        errorHandler(error, context) {
            console.error(error);
            console.info(context);
            return error.status === 404
                ? '<h1 style="color: black; margin-top: 5rem;">Page Not Found</h1>'
                : '<h1 style="color: black; margin-top: 5rem;">Oops! Something went wrong</h1>';
        },
    },
);

const render = location => {
    router.resolve(location).then(route => {
        const content = document.getElementById('content'); // eslint-disable-line
        clearInnerContent(content);

        const element = document.createElement(route.element);
        const attributes = route.attributes || {};

        for (let key of Object.keys(attributes)) {
            element.setAttribute(key, route.attributes[key]);
        }

        content.appendChild(element);
    });
};

function clearInnerContent(element) {
    for (let child of element.children) {
        element.removeChild(child);
    }
}

render(history.location);

history.listen(location => {
    render(location);
});

const navigate = to => {
    history.push(to);
};

export { history, navigate };
