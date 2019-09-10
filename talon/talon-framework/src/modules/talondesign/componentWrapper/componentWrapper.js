import { LightningElement, api } from 'lwc';
import componentService from 'talon/componentService';

export default class ComponentWrapper extends LightningElement {
    @api componentId;
    @api label;
    @api name;
    @api isLocked;
    @api attributes;

    async connectedCallback() {
        const element = await componentService.createElement(this.name);
        Object.assign(element, this.attributes);

        this.template.querySelector('.actualNode').appendChild(element);
    }

    async disconnectedCallback() {
        const actualNode = this.template.querySelector('.actualNode');
        while (actualNode.firstChild) {
            actualNode.removeChild(actualNode.firstChild);
        }
    }
}