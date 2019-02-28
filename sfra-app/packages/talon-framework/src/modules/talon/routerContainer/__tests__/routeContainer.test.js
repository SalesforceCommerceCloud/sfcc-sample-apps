import { createElement } from 'lwc';
import RouterContainer from 'talon/routerContainer';
import { subscribe } from 'talon/routingService';
import { default as mockAbout } from './fixtures/aboutTemplate';

jest.mock('talon/moduleRegistry', () => {
    return {
        getTemplate: () => {
            return Promise.resolve(mockAbout);
        }
    };
});

jest.mock('talon/routingService', () => {
    return {
        subscribe: jest.fn()
    };
});

beforeEach(() => {
    while (document.body.firstChild) {
        document.body.removeChild(document.body.firstChild);
    }

    jest.resetAllMocks();

    subscribe.mockReturnValue({
        unsubscribe: jest.fn()
    });
});

describe('talon/routerContainer', () => {
    it('renders no route', async () => {
        const element = createElement('talon-router-container', { is: RouterContainer });
        document.body.appendChild(element);

        expect(element).toMatchSnapshot();
    });

    it('renders route', () => {
        const element = createElement('talon-router-container', { is: RouterContainer });
        document.body.appendChild(element);

        const observer = subscribe.mock.calls[0][0];
        observer.next({ view: "about" });

        return Promise.resolve().then(() => {
            return new Promise(resolve => {
                window.requestAnimationFrame(resolve);
            });
        }).then(() => {
            expect(element).toMatchSnapshot();
        });
    });

    it('subscribes to route changes', async () => {
        const element = createElement('talon-router-container', { is: RouterContainer });
        document.body.appendChild(element);

        expect(subscribe).toHaveBeenCalledTimes(1);
    });

    it('unsubscribes when disconnected', async () => {
        const element = createElement('talon-router-container', { is: RouterContainer });
        document.body.appendChild(element);
        document.body.removeChild(element);

        const { unsubscribe } = subscribe.mock.results[0].value;
        expect(unsubscribe).toHaveBeenCalledTimes(1);
    });
});
