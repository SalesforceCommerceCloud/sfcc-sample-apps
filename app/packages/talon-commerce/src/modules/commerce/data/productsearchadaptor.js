import { register, ValueChangedEvent } from 'wire-service';

//
// Declarative access: register a wire adapter factory for  @wire(getTodo).
//
export const productsByQuery = Symbol('product-query');

register(productsByQuery, (eventTarget) => {
    let connected = false;
    let wireConfigData = null;

    function getProductByQuery(options) {
        let products = {};
        let wcdataStore = window.wcdataStore = window.wcdataStore || { product: {} };

        if (wcdataStore && wcdataStore['product']) {
            products = wcdataStore['product'];
            console.log('wcdataStore', products);
        }

        const query = options.query;
        if (!!options.query === false) {
            return [];
        } else {
            const sortRule = options.sortRule;
            const selectedRefinements = options.selectedRefinements;
            const localCacheKey = `${ query }:${ (sortRule && sortRule.id) ? sortRule.id : '' }`;
            if (!products.hasOwnProperty(localCacheKey) || Object.keys(options.selectedRefinements).length) {
                console.log('Load Products by query: ' + JSON.stringify(options));

                let params = { query: query };

                try {
                    // TODO: read from api config
                    var client = new window.ApolloClient({
                        uri: "http://localhost:3000/api"
                    });

                    return client.query({
                        query: window.gql`
                        {
                            productSearch(query: "${ query }") {
                                name
                                id
                                image {
                                    link
                                }
                            }
                        }
                     `
                    }).then(result => {
                        console.log(result);
                        return result;
                    }).catch((error) => {
                        console.log(error);
                        return {
                            error
                        };
                        // TODO: this is dummy test data
                        // return [
                        //     {
                        //         name: 'Modern Dress Shirt',
                        //         id: '74974310M'
                        //     },
                        //     {
                        //         name: 'Denim Shirt Jacket',
                        //         id: '25564426M'
                        //     }
                        // ];
                    });

                    /*
                    return fetchSearchResults( query, selectedRefinements, sortRule && sortRule.id ? sortRule.id : null )
                        .then( json => {
                            console.log( 'Fetched', json );
                            const p = products[ localCacheKey ] = json;
                            return p;
                        })
                        .catch( e => {   // eslint-disable-line no-unused-vars
                            this.setState( {
                                loading: false
                            } );
                        });
                        */

                } catch (e) {
                    return null;
                }
            }

            return products[localCacheKey];
        }
    }

    function loadProduct() {
        if (!wireConfigData) {
            return;
        }
        console.log("Load Product", wireConfigData);
        const productsOrPromise = getProductByQuery(wireConfigData);

        if (productsOrPromise === null) {
            console.error('error loading products')
            return;
        }

        // we have made a REST call to retrieve the product.
        if (productsOrPromise && productsOrPromise.then) {
            // From the promise resolve dispatch the wire-service value change event.
            // This will update the component data.
            productsOrPromise.then((data) => {
                console.log("Resolve Product Loaded, data", data);
                eventTarget.dispatchEvent(new ValueChangedEvent(Object.assign({ error: undefined }, data)));
            }, (error) => {
                console.log("Reject Load Product, error", error);
                eventTarget.dispatchEvent(new ValueChangedEvent({ data: undefined, error }));
            });
        } else {
            // From cached data dispatch the wire-service value change event.
            // This will update the component data
            console.log("Cached Product Loaded, data", productsOrPromise);
            eventTarget.dispatchEvent(new ValueChangedEvent(Object.assign({ error: undefined }, productsOrPromise )));
        }
    }

    // Invoked when wireConfigData is updated.
    eventTarget.addEventListener('config', (newWireConfigData) => {
        console.log("Event config, " + JSON.stringify(newWireConfigData));
        // Capture config for use during subscription.
        wireConfigData = newWireConfigData;
        //if (connected) {
        loadProduct();
        //}
    });

    // Invoked when component connected.
    eventTarget.addEventListener('connect', () => {
        console.log("Event connect, " + JSON.stringify(wireConfigData));
        connected = true;
        loadProduct();
    })

    // Invoked when component disconnected.
    eventTarget.addEventListener('disconnect', () => {
        console.log("Event disconnect");
        connected = false;
    });
});

export default register;