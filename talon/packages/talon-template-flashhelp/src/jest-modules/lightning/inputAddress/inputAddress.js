import { LightningElement, api } from 'lwc';

export default class LightningInputAddress extends LightningElement {
    @api addressLabel;
    @api streetLabel;
    @api cityLabel;
    @api provinceLabel;
    @api countryLabel;
    @api postalCodeLabel;
    @api required
    @api provinceOptions;
    @api countryOptions;
    @api id;
}