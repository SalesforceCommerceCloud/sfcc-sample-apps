import { LightningElement, wire } from 'lwc';
import { history } from '@lwce/router';

export default class StoreFront extends LightningElement {
    query = '';
    errorCount = 0;
    lastError = null;
    error = null;
    @wire(history) history;

    get hasError() {
        return this.error !== null;
    }

    updateQuery(e) {
        this.query = e.detail;
    }

    connectedCallback() {
        // Register an event listener to listen for errorevent dispatched by sub components
        this.template.addEventListener('errorevent', event => {
            this.errorCallback(event.detail.error);
        });
    }

    errorCallback(error) {
        if (
            (this.lastError
                ? error.message === this.lastError.message
                : true) &&
            this.errorCount < 1
        ) {
            console.error(error);

            this.lastError = this.error;
            this.error = error;
            this.errorCount++;

            const unlisten = this.template
                .querySelector('lwce-router')
                .getHistory()
                .listen(() => {
                    this.errorCount = 0;
                    this.lastError = null;
                    this.error = null;
                    unlisten();
                });
        }
    }
}
