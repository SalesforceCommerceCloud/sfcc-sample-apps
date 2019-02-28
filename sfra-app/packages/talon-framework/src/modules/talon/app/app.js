import { LightningElement, track } from 'lwc';
import { subscribe } from "talon/routingService";
import { getTemplate } from 'talon/moduleRegistry';
import { getThemeLayoutByView } from 'talon/themeService';
import defaultHtml from './app.html';

export default class App extends LightningElement {
    @track state = {
        template: defaultHtml
    };

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
        return this.state.template;
    }

    setRoute({ view }) {
        const themeLayout = getThemeLayoutByView(view);
        // only fetch a new template if it's necessary
        if (this.state.themeLayout !== themeLayout) {
            getTemplate(themeLayout).then(tmpl => {
                this.state.template = tmpl;
                this.state.themeLayout = themeLayout;
            });
        }
    }

    disconnectedCallback() {
        this.subscription.unsubscribe();
    }
}