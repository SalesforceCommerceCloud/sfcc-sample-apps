import { LightningElement, track } from 'lwc'

import * as router from 'talon/routingService';

/**
 * Search Bar where visitors can search for stuff
 */
export default class SearchBar extends LightningElement {

    @track query = '';

    constructor() {
        super();
        this.routeSubscription = router.subscribe( {
            next: this.routeSubHandler.bind( this )
        } );

    }

    routeSubHandler( view ) {
        setTimeout( () => {
            const queryParam = window.location.pathname.split( '/' )[ 2 ];

            this.query = queryParam || '';
        })
    }

    updateQueryEvent() {
        const updateQueryEvent = new CustomEvent('update-query-event', {detail: {query: this.query}});
        window.dispatchEvent(updateQueryEvent);
        console.log( router.router )
        router.navigateToRoute( `search`, {query: this.query} )
    }

    /**
     * Handles pressing 'Enter' in the search field
     */
    handleKeyUp = event => {
        const old = this.query;
        this.query = (event.target.value || '').trim();

        if (event.key === 'Enter') {
            if (!!this.query) {
                this.updateQueryEvent();
            }
            event.preventDefault();
        }
    }

    connectedCallback() {
    }

    renderedCallback() {
    }

}
