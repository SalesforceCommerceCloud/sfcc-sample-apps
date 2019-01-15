import { createElement } from 'lwc';
import { registerRoutes, setRouter } from 'talon/routingService';
import { register as registerConfigProvider } from 'talon/configProvider';
import footer from 'community_flashhelp/footer';
import routes from '../../../../routes.json';

function router() {}
router.base = () => {};
router.start = () => {};

setRouter(router);

registerRoutes(routes);

registerConfigProvider({
    getBasePath() {
        return "/base";
    }
});

describe('community_flashhelp/footer', () => {
    beforeEach(() => {
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('renders correctly', () => {
        const element = createElement('community_flashhelp-footer', { is: footer });
        document.body.appendChild(element);

        return Promise.resolve().then(() => {
            expect(element).toMatchSnapshot();
        });
    });
});
