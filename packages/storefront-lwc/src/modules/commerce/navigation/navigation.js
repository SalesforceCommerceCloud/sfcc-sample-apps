/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
import { LightningElement } from 'lwc'
// import { Link } from 'react-router-dom';
// import PropTypes from 'prop-types';
//
// import { fetchCategory } from '../data/store';

/**
 * Navigation component for header
 */
export default class Navigation extends LightningElement {

  constructor() {
    super();

    // this.state = {
    //   navItems: []
    // };
  }

  // fetchNavCategories() {
  //   this.setState({
  //     loading: true
  //   });
  //
  //   // check if we have initial state from the server
  //   if (this.props.staticContext && this.props.staticContext.initData) {
  //     this.props.staticContext.initData.forEach(apiData => {
  //       if (apiData._type === 'category') {
  //         this.setState({
  //           navItems: apiData.categories || [],
  //           loading: false
  //         });
  //       }
  //     });
  //   } else {
  //     fetchCategory('root')
  //       .then(json => {
  //         this.setState({
  //           navItems: json.categories || [],
  //           loading: false
  //         });
  //       })
  //       .catch(e => {   // eslint-disable-line no-unused-vars
  //         this.setState({
  //           loading: false
  //         });
  //       });
  //   }
  // }

  // connectedCallback() {
  //   this.fetchNavCategories();
  // }

  // render() {
  //   return (
  //     <div className='container'>
  //       <div className='row'>
  //         <div className='navbar navbar-expand-md bg-inverse col-12'>
  //           <div className='menu-group'>
  //             <ul className='nav navbar-nav' role='menu'>
  //               {this.state.navItems.map(item => (
  //                 <li
  //                   className='nav-item dropdown'
  //                   role='menuitem'
  //                   key={item.id}
  //                 >
  //                   <Link className='nav-link' to={'/search/' + item.name}>{item.name}
  //                   </Link>
  //                 </li>
  //               ))}
  //               <li className='nav-item' role='menuitem'>
  //                 <Link className='nav-link' to='/login'>
  //                   <i className='fa fa-sign-in' aria-hidden='true'> </i>
  //                   Login
  //                 </Link>
  //               </li>
  //             </ul>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }
}

// Navigation.propTypes = {
//   staticContext: PropTypes.shape({
//     initData: PropTypes.array.isRequired
//   })
// };
