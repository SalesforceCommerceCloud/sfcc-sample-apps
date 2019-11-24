import { LightningElement, api } from 'lwc'
// import PropTypes from 'prop-types';
//
// import Currency from 'react-currency-formatter';

export default class ProductPrice extends LightningElement {

   @api apiPrice;

   get price () {
     return this.apiPrice.toFixed(2);
   }
}
