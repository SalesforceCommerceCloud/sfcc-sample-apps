import { LightningElement, api } from 'lwc';

export default class LWCELink extends LightningElement {
    @api title;
    @api href;
    @api role;
    @api ariaPressed;
}
