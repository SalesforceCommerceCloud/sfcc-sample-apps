import { LightningElement, api } from 'lwc';

export default class ProductAvailability extends LightningElement {
    @api inventory;
    @api type;
}
