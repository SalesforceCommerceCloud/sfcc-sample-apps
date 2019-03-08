import { LightningElement, track } from 'lwc';
import { subscribe } from "talon/routingService";
import { getTemplate } from 'talon/moduleRegistry';
import { getThemeLayoutByView } from 'talon/themeService';
import defaultHtml from './app.html';

export default class App extends LightningElement {
    @track template = defaultHtml;
    @track attributes;
    themeLayout;
    @track routeParams = {};

    /**
     * Subscribe to route changes
     */
    constructor() {
        super();
        this.subscription = subscribe({
            next: this.setRoute.bind(this)
        });
    }

    render() {
        return this.template;
    }

    setRoute({ view }, params = {}) {
        const themeLayout = getThemeLayoutByView(view);

        // only fetch a new template if it's necessary
        if (this.themeLayout !== themeLayout) {
            getTemplate(themeLayout).then(tmpl => {
                this.template = tmpl.html;
                this.themeLayout = themeLayout;
                this.routeParams = params;
                this.attributes = tmpl.attributes(this);
            });
        } else {
            // update any route params
            this.routeParams = params;
        }
    }

    disconnectedCallback() {
        this.subscription.unsubscribe();
    }
}