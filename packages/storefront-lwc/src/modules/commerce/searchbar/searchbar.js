import { LightningElement, track } from 'lwc'

import * as router from 'webruntime/routingService';
import { navigate } from 'webruntime/routingService';

/**
 * Search Bar where visitors can search for stuff
 */
export default class SearchBar extends LightningElement {

    @track query = '';
    routeSubscription;

    constructor() {
        super();
        console.log('*************************** subs')
        this.routeSubscription = router.subscribe(this.routeSubHandler.bind(this));
    }

    routeSubHandler(view) {
        this.query = view.attributes.query || '';
    }

    updateQueryEvent() {
        const updateQueryEvent = new CustomEvent('update-query-event', {detail: {query: this.query}});
        window.dispatchEvent(updateQueryEvent);

        navigate({
            id: 'search',
            attributes: {
                query: this.query
            }
        });
    }

    /**
     * Handles pressing 'Enter' in the search field
     */
    handleKeyUp(event) {
        this.query = (event.target.value || '').trim();

        if (event.key === 'Enter') {
            if (!!this.query) {
                this.updateQueryEvent();
            }
            event.preventDefault();
        }
    };

    connectedCallback() {
    }

    renderedCallback() {
    }

    disconnectedCallback(){
    }
}
