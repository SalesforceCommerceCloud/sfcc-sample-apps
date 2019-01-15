import {LightningElement, api} from "lwc";

export default class LightningFormattedRichText extends LightningElement {
    @api label;
    @api readOnly = false;
    @api type;
    @api value;
    @api variant;
    @api name;
    @api required;
    @api maxLength;
    @api disabled;
    @api placeholder;
    @api id;
}
