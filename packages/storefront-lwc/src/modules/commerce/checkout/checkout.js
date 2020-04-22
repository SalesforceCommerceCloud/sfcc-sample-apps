import { LightningElement, wire, track } from 'lwc';
import { routeParams, history } from '@lwce/router';
import { GET_BASKET } from '../basket/gql.js';
import { useQuery } from '@lwce/apollo-client';
import { dispatchErrorEvent } from 'commerce/helpers';

const SHIPPING_STAGE = 'shipping';
const PAYMENT_STAGE = 'payment';
const SUMMARY_STAGE = 'summary';
const CONFIRMATION_STAGE = 'confirmation';

export default class Checkout extends LightningElement {
    loading = true;
    processing = false;
    basket = {};

    @wire(routeParams) routeParams;
    @wire(history) history;

    @wire(useQuery, { query: GET_BASKET, lazy: false })
    getBasket(response) {
        this.loading = response.loading;

        if (response.initialized) {
            if (response.error) {
                dispatchErrorEvent.call(this, response.error);
            } else {
                this.basket = response.data.getBasket;
            }
        }
    }

    @track checkoutDetails = {
        shipping: {},
        payment: {},
    };

    get waitingForNextStage() {
        if (this.processing) return true;

        // Add some logic for whether the next button should be enabled
        if (this.stage === SHIPPING_STAGE) return false;
        if (this.stage === PAYMENT_STAGE) return false;
        if (this.stage === SUMMARY_STAGE) return false;
        return true;
    }

    updateShippingDetails(e) {
        this.checkoutDetails.shipping = e.target.detail;
    }

    updatePaymentDetails(e) {
        this.checkoutDetails.payment = e.target.detail;
    }

    get shippingActive() {
        return this.stage === SHIPPING_STAGE;
    }
    get paymentActive() {
        return this.stage === PAYMENT_STAGE;
    }
    get summaryActive() {
        return this.stage === SUMMARY_STAGE;
    }
    get confirmationActive() {
        return this.stage === CONFIRMATION_STAGE;
    }

    get stage() {
        return this.routeParams && this.routeParams.checkoutStage;
    }

    get nextText() {
        if (this.stage === SHIPPING_STAGE) return 'Next: Payment';
        return 'Next: Place Order';
    }

    nextStage() {
        this.processing = true;

        this.saveStage(this.stage)
            .then(nextStage => {
                this.processing = false;
                this.history.push(`/checkout/${nextStage}`);
            })
            .catch(error => {
                this.processing = false;
                dispatchErrorEvent.call(this, error);
            });
    }

    /**
     * Given the current stage, send a mutation to save data.
     * When finished, return the next stage to progress to.
     * @param {string} stage - current stage to save
     * @return {Promsie<string>} a promise resolving with the next stage to move to
     */
    async saveStage(stage) {
        // a fake wait to mock a server request
        await (async function() {
            return new Promise(resolve => setTimeout(resolve, 2000));
        })();

        switch (stage) {
            case SHIPPING_STAGE:
                // await mutation to save
                return PAYMENT_STAGE;
            case PAYMENT_STAGE:
                // await mutation to save
                return SUMMARY_STAGE;
            case SUMMARY_STAGE:
                // await mutation to save
                return CONFIRMATION_STAGE;
        }
    }
}
