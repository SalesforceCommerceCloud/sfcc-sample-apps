import { LightningElement, api } from 'lwc';

export default class RegionWrapper extends LightningElement {
    @api componentId;
    @api label;
    @api name;
    @api type;
    @api isLocked;
}