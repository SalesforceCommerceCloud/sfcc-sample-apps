import UniversalRouter from 'universal-router';
import { createBrowserHistory } from 'history';
import xss from 'xss';

const history = createBrowserHistory();
const router = new UniversalRouter(
    [
        {
            path: '',
            action: () => '<commerce-home></commerce-home>',
        },
        {
            path: '/search/:query',
            action: location => {
                var query = xss(`${location.params.query}`);
                return `<commerce-product-search-results query="${query}"></commerce-product-search-results>`;
            },
        },
        {
            path: '/cart',
            action: () =>
                '<h1 style="color: black; margin-top: 5rem;">Cart</h1>',
        },
        {
            path: '/product/:pid',
            action: location =>
                `<commerce-product-detail pid="${location.params.pid}"></commerce-product-detail>`,
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
    router.resolve(location).then(content => {
        document.getElementById('content').innerHTML = content; // eslint-disable-line
    });
};

render(history.location);

history.listen(location => {
    render(location);
});

const navigate = to => {
    history.push(to);
};

export { history, navigate };
