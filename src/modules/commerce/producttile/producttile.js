import {LightningElement, api} from 'lwc'

// import * as router from 'talon/routingService';
import { navigate } from 'talon/routingService';

export default class ProductTile extends LightningElement {

    @api product;

    productDetail() {
        console.log(this.product.id);
        //router.navigateToRoute(`product`, {pid: this.product.id})

        navigate({
            id: 'product',
            attributes: {
                pid: this.product.id
            }
        });

    }
}
