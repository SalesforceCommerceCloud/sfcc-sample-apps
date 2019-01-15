import App  from 'talon/app';
import { createElement } from 'lwc';
import { subscribe } from 'talon/routingService';
import { default as mockTemplate } from './fixtures/themeLayout';
import { getTemplate } from 'talon/moduleRegistry';
import { getThemeLayoutByView } from 'talon/themeService';

beforeEach(() => {
    while (document.body.firstChild) {
        document.body.removeChild(document.body.firstChild);
    }

    jest.resetAllMocks();

    subscribe.mockReturnValue({
        unsubscribe: jest.fn()
    });

    getThemeLayoutByView.mockReturnValue("themeLayout");
    getTemplate.mockReturnValue(Promise.resolve(mockTemplate));
});

jest.mock('talon/moduleRegistry', () => {
    return {
        getTemplate: jest.fn()
    };
});

jest.mock('talon/themeService', () => {
    return {
        getThemeLayoutByView: jest.fn()
    };
});

jest.mock('talon/routingService', () => {
    return {
        subscribe: jest.fn()
    };
});

describe('talon/app', () => {
    it('renders the theme layout', () => {
        const element = createElement('talon-app', { is: App });
        document.body.appendChild(element);

        const observer = subscribe.mock.calls[0][0];
        observer.next({ view: "inner" });

        return Promise.resolve().then(() => {
            return new Promise(resolve => {
                window.requestAnimationFrame(resolve);
            });
        }).then(() => {
            expect(element).toMatchSnapshot();
        });
    });

    it('renders no theme layout', async () => {
        const element = createElement('talon-app', { is: App });
        document.body.appendChild(element);

        expect(element).toMatchSnapshot();
    });

    it('does not fetch the template if the theme layout hasnt changed', async () => {
        const element = createElement('talon-app', { is: App });
        document.body.appendChild(element);

        const observer = subscribe.mock.calls[0][0];
        observer.next({ view: "inner" });

        return Promise.resolve().then(() => {
            expect(getTemplate).toHaveBeenCalledTimes(1);
            return new Promise(resolve => {
                observer.next({ view: "inner" });
                window.requestAnimationFrame(resolve);
            }).then(() => {
                expect(getTemplate).toHaveBeenCalledTimes(1);
            });
        });
    });

    it('subscribes to route changes', async () => {
        const element = createElement('talon-app', { is: App });
        document.body.appendChild(element);

        expect(subscribe).toHaveBeenCalledTimes(1);
    });

    it('unsubscribes when disconnected', async () => {
        const element = createElement('talon-app', { is: App });
        document.body.appendChild(element);
        document.body.removeChild(element);

        const { unsubscribe } = subscribe.mock.results[0].value;
        expect(unsubscribe).toHaveBeenCalledTimes(1);
    });
});