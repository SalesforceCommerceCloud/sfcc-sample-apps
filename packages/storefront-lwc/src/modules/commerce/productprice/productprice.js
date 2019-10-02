import { LightningElement, api } from 'lwc'
// import PropTypes from 'prop-types';
//
// import Currency from 'react-currency-formatter';

export default class ProductPrice extends LightningElement {

   @api product;

  // render() {
  //   const product = this.props.product;
  //
  //   if (product) {
  //     if (product.price_max) {
  //       return (
  //         <span className='sales'>
  //           <Currency quantity={product.price} currency={product.currency} />
  //           -
  //           <Currency quantity={product.price_max} currency={product.currency} />
  //         </span>
  //       );
  //     } else {
  //       return (
  //         <span className='sales'>
  //           <Currency quantity={product.price} currency={product.currency} />
  //         </span>
  //       );
  //     }
  //   }
  // }
}

// ProductPrice.propTypes = {
//   product: PropTypes.shape({
//     currency: PropTypes.string.isRequired,
//     price: PropTypes.number.isRequired,
//     price_max: PropTypes.number
//   })
// };
