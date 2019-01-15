import { createElement } from 'lwc';
import Element from 'community_flashhelp/loginForm';
import { getShadowRoot } from "lwc-test-utils";
import getIsUserNamePasswordEnabled from '@salesforce/apex/appLauncher.LoginFormController.getIsUserNamePasswordEnabled';
import login from '@salesforce/apex/applauncher.LoginFormController.loginGetPageRefUrl';
import { Exception } from 'handlebars';

jest.mock('@salesforce/apex/appLauncher.LoginFormController.getIsUserNamePasswordEnabled', () => ({
    default: jest.fn()
}), { virtual: true });

jest.mock('@salesforce/apex/appLauncher.LoginFormController.loginGetPageRefUrl', () => ({
    default: jest.fn()
}), { virtual: true });

const createLoginForm = () => {
    const element = createElement('community_flashhelp-loginForm', { is: Element });
    document.body.appendChild(element);
    return element;
};

const waitForRerender = (callBack) => {
    setTimeout(() => {
        callBack();
    }, 100);
};

describe('community_flashhelp/loginForm', () => {
    beforeEach(() => {
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('renders correctly when getIsUserNamePasswordEnabled is true', (done) => {
        getIsUserNamePasswordEnabled.mockImplementation(() => Promise.resolve(true));

        const element = createLoginForm();

        return Promise.resolve().then(() => {
            setTimeout(() => {
                expect(element).toMatchSnapshot();
                done();
            }, 100); // wait for rerender
        });
    });

    it('renders correctly when getIsUserNamePasswordEnabled is false', (done) => {
        getIsUserNamePasswordEnabled.mockImplementation(() => Promise.resolve(false));

        const element = createLoginForm();

        return Promise.resolve().then(() => {
            setTimeout(() => {
                expect(element).toMatchSnapshot();
                done();
            }, 100); // wait for rerender
        });
    });

    it('display error message when username password is invalid', (done) => {
        getIsUserNamePasswordEnabled.mockImplementation(() => Promise.resolve(true));
        const errorMessage = "error message";
        login.mockImplementation(() => Promise.resolve(errorMessage));

        global.URL = function (url) {
            throw new Exception(url);
        };

        const element = createLoginForm();

        return Promise.resolve().then(() => {
            const verifyErrorMessage = () => {
                const msg = getShadowRoot(element).querySelector('lightning-formatted-rich-text').value;
                expect(msg).toBe(errorMessage);
                expect(element).toMatchSnapshot();
                done();
            };

            const loginSubmit = () => {
                getShadowRoot(element).querySelector('[data-user]').value = "user";
                getShadowRoot(element).querySelector('[data-password]').value = "password";

                const lightningButton = getShadowRoot(element).querySelector('lightning-button');
                const button = getShadowRoot(lightningButton).querySelector('button');
                button.click();

                waitForRerender(verifyErrorMessage);
            };

            waitForRerender(loginSubmit);
        });
    });
});
