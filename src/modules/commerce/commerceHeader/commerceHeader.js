import { LightningElement, api, track } from 'lwc'

export default class CommerceHeader extends LightningElement {

    @track logo;
    @api test;

    constructor () {
        super();
        this.logo = '/assets/images/logo.svg';
    }

    connectedCallback () {
    }

    renderedCallback () {
    }

    disconnectedCallback() {
    }
}
