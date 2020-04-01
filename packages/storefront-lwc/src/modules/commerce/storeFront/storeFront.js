import { LightningElement } from 'lwc';

export default class StoreFront extends LightningElement {
    query = '';

    updateQuery(e) {
        this.query = e.detail;
    }
}
