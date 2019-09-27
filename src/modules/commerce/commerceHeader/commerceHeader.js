import { LightningElement, api, track } from 'lwc'

export default class CommerceHeader extends LightningElement {

    @track logo;

    @api test;
    subscription;

    constructor () {
        super();
        this.logo = '/assets/images/logo.svg';
    }

    connectedCallback () {
        console.log('CommerceHeader connectedCallback()')
    }

    renderedCallback () {
        console.log('CommerceHeader renderedCallback()', this.test)
    }

    disconnectedCallback() {
        this.subscription.unsubscribe();
    }
}
