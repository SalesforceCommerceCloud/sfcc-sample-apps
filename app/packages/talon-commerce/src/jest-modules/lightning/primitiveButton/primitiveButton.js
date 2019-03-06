import { LightningElement, api } from 'lwc';

export default class LightningPrimitiveButton extends LightningElement {
    @api disabled;
    @api accessKey;
    @api title;
    @api tabIndex;
    @api ariaLabel;
    @api ariaDescribedBy;
    @api ariaControls;
    @api ariaLive;
    @api ariaAtomic;
    @api focus() {}
}
