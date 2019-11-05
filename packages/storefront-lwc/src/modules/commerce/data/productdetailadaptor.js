import { register, ValueChangedEvent } from 'wire-service';

//import ApolloClient from 'ApolloClient';

export const productDetailById = Symbol('product-detail');

register(productDetailById, (eventTarget) => {
    console.log("Register wire adapter", eventTarget);

    /**
     * Make the server request for product data
     * @param options
     * @return {*}
     */
    const fetchProductById = (options) => {
        const pid = options.pid;
        console.log('Load Product by pid: ' + pid);

        if (pid && pid.length) {
            try {
                // TODO: read from api config
                var client = new window.ApolloClient({
                    uri: window.apiconfig.COMMERCE_API_PATH || "/graphql"
                });
                return client.query({
                    query: window.gql`
                    {
                        product(id: "${ pid }") {
                            name
                            id
                            page_description
                            long_description
                            short_description
                            currency
                            price
                            primary_category_id
                            image
                            images(allImages: true, size: "large") {
                                title
                                alt
                                link
                            }
                        }
                    }
                 `
                }).then(result => {
                    return result.data.product;
                }).catch((error) => {
                    console.log(error);
                    return {};
                });
            } catch (e) {
                console.log("error", e);
                return {};
            }
        } else {
            return {};
        }
    };

    /**
     * Initiate product loading from server if wire config data is available.
     *
     * @param wireConfigData the changed lwc component wire properties.
     */
    const handleWireEvent = (wireConfigData) => {

        const result = fetchProductById(wireConfigData);
        if (!result) {
            return;
        }

        // we have made a REST call to retrieve the product.
        if (result && result.then) {
            // From the promise resolve dispatch the wire-service value change event.
            // This will update the component data.
            result.then((data) => {
                eventTarget.dispatchEvent(new ValueChangedEvent(data));
            }, (error) => {
                eventTarget.dispatchEvent(new ValueChangedEvent({ data: undefined, error }));
            });
        } else {
            // From cached data dispatch the wire-service value change event.
            // This will update the component data
            eventTarget.dispatchEvent(new ValueChangedEvent(result));
        }
    }

    // Invoked when wireConfigData is updated.
    eventTarget.addEventListener('config', (configData) => handleWireEvent(configData));
});

export default register;
