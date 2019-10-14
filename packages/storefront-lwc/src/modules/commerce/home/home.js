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

    renderedCallback() {
    }
}

export default Home;

// Home.propTypes = {
//   staticContext: PropTypes.shape({
//     initData: PropTypes.array.isRequired
//   })
// };
