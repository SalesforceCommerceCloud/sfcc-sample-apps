import { LightningElement, api } from 'lwc'

// import PropTypes from 'prop-types';
// import { Link } from 'react-router-dom';
//
// import ProductPrice from '../Product/ProductPrice';

export default class ProductTile extends LightningElement {

  @api product

  // render() {
  //   const product = this.props.product;
  //   const image = product.image;
  //   return (
  //     <div key={product.product_id} className='product-tile'>
  //       <div className='image-container'>
  //         <Link to={'/product/' + product.product_id}>
  //           <img className='tile-image' src={image.dis_base_link + '?sw=400&sh=400'} alt={image.alt} />
  //         </Link>
  //       </div>
  //       <div className='tile-body'>
  //         <div className='color-swatches'></div>
  //         <div className='pdp-link'>
  //           <Link to={'/product/' + product.product_id}>{product.product_name}</Link>
  //         </div>
  //         <div className='price'>
  //           <ProductPrice product={product} />
  //         </div>
  //         <div className='row tile-body-footer'>
  //           <div className='ratings col-xs-12 col-sm-6'>
  //             <i className='fa fa-star' aria-hidden='true'></i>
  //             <i className='fa fa-star' aria-hidden='true'></i>
  //             <i className='fa fa-star' aria-hidden='true'></i>
  //             <i className='fa fa-star' aria-hidden='true'></i>
  //             <i className='fa fa-star-half-o' aria-hidden='true'></i>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }
}

// ProductTile.propTypes = {
//   product: PropTypes.shape({
//     product_id: PropTypes.string.isRequired,
//     product_name: PropTypes.string,
//     currency: PropTypes.string,
//     price: PropTypes.number,
//     image: PropTypes.shape({
//       dis_base_link: PropTypes.string.isRequired,
//       alt: PropTypes.string
//     })
//   }).isRequired
// };
