import { LightningElement, wire } from 'lwc';
import { history } from '@lwce/router';

export default class StoreFront extends LightningElement {
    query = '';
    error = null;
    @wire(history) history;

    get hasError() {
        return this.error !== null;
    }

    updateQuery(e) {
        this.query = e.detail;
    }

    errorCallback(error) {
        this.error = error;

        const unlisten = this.template
            .querySelector('lwce-router')
            .getHistory()
            .listen(() => {
                this.error = null;
                unlisten();
            });
    }
}
