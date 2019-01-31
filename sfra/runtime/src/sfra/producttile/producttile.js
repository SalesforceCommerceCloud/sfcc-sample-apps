import {LightningElement, api} from 'lwc'

import ApolloClient from 'ApolloClient';

export default class ProductTile extends LightningElement {

    @api product

    connectedCallback() {
        console.log('ApolloClient work can go here', ApolloClient);
    }

}

