import { LightningElement, api } from 'lwc';

export default class Total extends LightningElement {

    @api description;
    @api descriptionClass;
    @api total;
    @api totalClass;

    constructor() {
        super();
    }

}