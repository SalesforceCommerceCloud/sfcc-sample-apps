import {LightningElement, api} from 'lwc'

import * as router from 'talon/routingService';

export default class ProductTile extends LightningElement {

    @api product;

    productDetail() {
        router.navigateToRoute(`product`, {pid: this.product.product_id})
    }
}
