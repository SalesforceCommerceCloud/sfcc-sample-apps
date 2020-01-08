/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
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
