import { LightningElement, api } from 'lwc';

export default class CheckoutShipping extends LightningElement {
    @api active;
    @api shipping;
}
