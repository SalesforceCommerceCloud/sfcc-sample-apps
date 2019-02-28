import {register, ValueChangedEvent} from 'wire-service';

//import ApolloClient from 'ApolloClient';

export const productById = Symbol('product');

register(productById, (eventTarget) => {
    console.log("Register wire adapter", eventTarget);
    let connected = false;
    let wireConfigData = null;
    const getProductById = function (options) {
        const pid = options.pid;
        console.log('Load Product by pid: ' + pid);

        if (pid && pid.length) {
            try {
                var client = new window.ApolloClient({
                    uri: "http://localhost:3000/api"
                });
                return client.query({
                    query: window.gql`
                    {
                        product(id: "${pid}") {
                            name
                            id
                            page_description
                            long_description
                            short_description
                            currency
                            price
                            primary_category_id
                            image
                        }
                    }
                 `
                }).then(result => {
                    console.log(result.data.product)
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

    function loadProduct() {
        if (!wireConfigData) {
            return;
        }
        console.log("Load Product", wireConfigData);
        const result = getProductById(wireConfigData);

        if (!result) {
            return;
        }

        // we have made a REST call to retrieve the product.
        if (result && result.then) {
            // From the promise resolve dispatch the wire-service value change event.
            // This will update the component data.
            result.then((data) => {
                console.log("Resolve Product Loaded, data", data);
                eventTarget.dispatchEvent(new ValueChangedEvent(data));
            }, (error) => {
                console.log("Reject Load Product, error", error);
                eventTarget.dispatchEvent(new ValueChangedEvent({data: undefined, error}));
            });
        } else {
            // From cached data dispatch the wire-service value change event.
            // This will update the component data
            console.log("Cached Product Loaded, data", result);
            eventTarget.dispatchEvent(new ValueChangedEvent(result));
        }
    }

    // Invoked when wireConfigData is updated.
    eventTarget.addEventListener('config', (newWireConfigData) => {
        console.log("Event config, " + JSON.stringify(newWireConfigData));
        // Capture config for use during subscription.
        wireConfigData = newWireConfigData;
        if (connected) {
            loadProduct();
        }
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
