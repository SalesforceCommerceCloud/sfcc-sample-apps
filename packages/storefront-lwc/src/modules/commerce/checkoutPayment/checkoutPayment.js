import { LightningElement, api } from 'lwc';

export default class CheckoutPayment extends LightningElement {
    @api active;
    @api payment;
}
