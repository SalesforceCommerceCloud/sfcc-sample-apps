import UniversalRouter from "universal-router";
import { createBrowserHistory } from "history";

const history = createBrowserHistory();
const router = new UniversalRouter(
    [
        {
            path: "",
            action: () => "<commerce-home></commerce-home>",
        },
        {
            path: "/search/:query",
            action: location =>
                `<commerce-product-search-results query="${location.params.query}"></commerce-product-search-results>`,
        },
        {
            path: "/cart",
            action: () => '<h1 style="color: black; margin-top: 5rem;">Cart</h1>',
        },
        {
            path: "/product/:pid",
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
    }
);

function render(location) {
    router.resolve(location).then(content => {
        document.getElementById("content").innerHTML = content; // eslint-disable-line
    });
}

render(history.location);

const unlisten = history.listen(location => {
    render(location);
});

function navigate(to) {
    history.push(to);
}

export { history, navigate };
