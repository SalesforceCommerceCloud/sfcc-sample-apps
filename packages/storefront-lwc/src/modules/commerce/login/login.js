import { LightningElement, api, track } from 'lwc'
import * as router from 'webruntime/routingService';

export default class Login extends LightningElement {

    routeSubscription;

    @track loginActive = true;

    get registerTabPaneClass() {
        return !this.loginActive ? 'tab-pane active' : 'tab-pane';
    }

    get registerTabLinkClass() {
        return !this.loginActive ? 'nav-link active' : 'nav-link';
    }

    get loginTabPaneClass() {
        return this.loginActive ? 'tab-pane active' : 'tab-pane';
    }

    get loginTabLinkClass() {
        return this.loginActive ? 'nav-link active' : 'nav-link';
    }

    constructor() {
        super();
        this.routeSubscription = router.subscribe(this.routeSubHandler.bind(this));
    }

    routeSubHandler( view ) {
        this.loginActive = !!view.attributes && view.attributes.pageName === 'login';
    }
}

