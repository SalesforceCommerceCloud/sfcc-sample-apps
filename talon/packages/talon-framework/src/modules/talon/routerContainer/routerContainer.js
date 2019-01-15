import { LightningElement, track } from 'lwc';
import { subscribe } from "talon/routingService";
import { getTemplate } from 'talon/moduleRegistry';
import defaultHtml from './routerContainer.html';

export default class RouterContainer extends LightningElement {
    @track state = {
        template: defaultHtml
    };

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
        return this.state.template;
    }

    setRoute({ view }) {
        getTemplate(view).then(tmpl => {
            this.state.template = tmpl;
        });
    }

    disconnectedCallback() {
        this.subscription.unsubscribe();
    }
}