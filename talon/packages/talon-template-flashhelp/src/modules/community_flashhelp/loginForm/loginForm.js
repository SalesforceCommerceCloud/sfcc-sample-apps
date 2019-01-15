import { LightningElement, track } from 'lwc';
import { getStartUrlFromCurrentUrl, ENTER_KEY } from './utils';
import login from '@salesforce/apex/applauncher.LoginFormController.loginGetPageRefUrl';
import getIsUsernamePasswordEnabled from '@salesforce/apex/applauncher.LoginFormController.getIsUsernamePasswordEnabled';

export default class LoginForm extends LightningElement {
    @track
    state = {
        title: 'Login to the community',
        errorMessage: '',
        showError: false,
        isUsernamePasswordEnabled: false,
    };

    get userInput() {
        return this.template.querySelector('[data-user]');
    }

    get passwordInput() {
        return this.template.querySelector('[data-password]');
    }

    get startUrl() {
        const startUrl = getStartUrlFromCurrentUrl();
        return startUrl ? decodeURIComponent(startUrl) : "";
    }

    async isUsernamePasswordEnabled() {
        this.state.isUsernamePasswordEnabled = await getIsUsernamePasswordEnabled({});
    }

    connectedCallback() {
        this.isUsernamePasswordEnabled();
    }

    handleKeyDown(evt) {
        if (evt.keyCode !== ENTER_KEY) {
            return;
        }
        evt.preventDefault();
        if (evt.target === this.userInput) {
            this.passwordInput.focus();
        } else if (evt.target === this.passwordInput) {
            this.submit();
            this.template.querySelector('[data-submitbtn]').focus();
        }
    }

    async submit() {
        const rawResult = await login({
            username: this.userInput.value, password: this.passwordInput.value, startUrl: this.startUrl
        });
        if (rawResult) {
            try {
                const url = new URL(rawResult);
                window.location.replace(url.href);
            } catch (e) {
                this.state.showError = true;
                this.state.errorMessage = rawResult;
            }
        }
    }
}