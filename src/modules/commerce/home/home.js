import { LightningElement } from 'lwc'
// import PropTypes from 'prop-types';
import { fetchContents } from 'commerce/data';

// import './../sfra-static/css/homePage.css';

/**
 * Homepage component. Renders homepage content.
 */
class Home extends LightningElement {

    content;
    tmpl;

    constructor() {
        super();
    }

    connectedCallback() {

        try {
            // TODO: read from api config
            var client = new window.ApolloClient({
                uri: window.apiconfig.COMMERCE_API_PATH || "/graphql"
            });

            return client.query({
                query: window.gql`
                        {
                            content(contentIds: ["home-main", "home-categories"]) {
                            body
                            }
                        }
                     `
            }).then(result => {
                console.log(result);
                const container = this.template.querySelector('.container');
                container.innerHTML += result.data.content[0].body;
                container.innerHTML += result.data.content[1].body
                return result;
            }).catch((error) => {
                console.log(error);
                return {
                    error
                };
            });
        } catch (e) {
            return null;
        }

        // fetchContents( [ 'home-main', 'home-categories' ] )
        //     .then( json => {
        //         console.log( json );
        //         if (json.data && json.data.length ) {
        //             json.data.forEach(data => {
        //                 const container = this.template.querySelector('.container');
        //                 container.innerHTML += data.c_body;
        //             })
        //         }
        //     } )
        //     .catch( e => {   // eslint-disable-line no-unused-vars
        //         console.log( e )
        //     } );
    }

    renderedCallback() {
    }
}

export default Home;

// Home.propTypes = {
//   staticContext: PropTypes.shape({
//     initData: PropTypes.array.isRequired
//   })
// };
