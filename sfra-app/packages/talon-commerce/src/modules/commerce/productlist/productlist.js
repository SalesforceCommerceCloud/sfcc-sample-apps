import { LightningElement, api } from 'lwc'
// import PropTypes from 'prop-types';
// import ProductTile from './ProductTile';

export default class ProductList extends LightningElement {

  @api products

  // render() {
  //   return (
  //     <div className='row product-grid'>
  //       {products.map(product =>
  //         <div className='col-6 col-sm-4' key={product.product_id}>
  //           <div className='product' data-pid={product.product_id}>
  //             <ProductTile product={product} />
  //           </div>
  //         </div>
  //       )}
  //     </div>
  //   );
  // }
}


// ProductList.propTypes = {
//   products: PropTypes.array.isRequired
// };
