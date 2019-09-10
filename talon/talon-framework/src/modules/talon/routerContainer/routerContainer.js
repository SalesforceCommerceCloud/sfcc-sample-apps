import { LightningElement, track } from 'lwc';
import { subscribe } from "talon/routingService";
import { getTemplate } from 'talon/moduleRegistry';
import defaultHtml from './routerContainer.html';

export default class RouterContainer extends LightningElement {
    @track template = defaultHtml;
    @track attributes;
    @track routeParams = {};

    /**
     * Subscribe to route changes
     */
    constructor() {
        super();
        if (!this.subscription) {
            this.subscription = subscribe({
                next: this.setRoute.bind(this)
            });
        }
    }

    render() {
        return this.template;
    }

    setRoute({ view }, params = {}) {
        getTemplate(view).then(tmpl => {
            this.template = tmpl.html;
            this.routeParams = params;
            this.attributes = tmpl.attributes(this);
        });
    }

    disconnectedCallback() {
        this.subscription.unsubscribe();
    }
}