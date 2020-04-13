/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
import { LightningElement, wire } from 'lwc';
import { useQuery } from '@lwce/apollo-client';
import gql from 'graphql-tag';

const QUERY = gql`
    query {
        getBasketProductCount
    }
`;

/**
 * Header basket component that should show up in the header
 */
export default class HeaderBasket extends LightningElement {
    quantity = 0;

    @wire(useQuery, {
        query: QUERY,
        lazy: false,
    })
    updateProductsTotal(response) {
        if (response.initialized && response.data) {
            this.quantity = response.data.getBasketProductCount || 0;
        } else {
            this.quantity = 0;
        }
    }

    connectedCallback() {
        addEventListener('headerbasketcount', event => {
            this.quantity = event.detail.quantity;
        });

        addEventListener('removelineitem', event => {
            this.quantity = event.detail.updatedBasket.totalProductsQuantity;
        });
    }
}
