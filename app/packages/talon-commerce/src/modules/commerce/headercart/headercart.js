import { LightningElement } from 'lwc'
// import { Link } from 'react-router-dom';
//
// import { getCurrentBasket } from '../models/basket';

/**
 * Header cart component that should show up in the header
 */
export default class HeaderCart extends LightningElement {

  // render() {
  //   const basket = getCurrentBasket();
  //
  //   return (
  //     <div className='minicart'>
  //       <div className='minicart-total hide-link-med'>
  //         <Link to='/cart'>
  //           <i className='minicart-icon fa fa-shopping-bag'></i>
  //           <span className='minicart-quantity'>
  //             {(basket && basket.product_items) ? basket.product_items.map(item => item.quantity).reduce((a, b) => a + b, 0) : '0'}
  //           </span>
  //         </Link>
  //       </div>
  //     </div>
  //   );
  // }
}

