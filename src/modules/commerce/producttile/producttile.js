import {LightningElement, api} from 'lwc'

import * as router from 'talon/routingService';

export default class ProductTile extends LightningElement {

    @api product;

    productDetail() {
        console.log(this.product.id);
        router.navigateToRoute(`product`, {pid: this.product.id})
    }
}
