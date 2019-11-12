import { LightningElement, api, track } from 'lwc';
import { ShoppingCart } from 'commerce/data';

/**
 * ToastMessage component. Renders toastMessage component
 */
class ToastMessage extends LightningElement {
    @api alertSuccessMessage;
    @api alertFailMessage;
    @track isVisible = false;
    @track addToCartSucceed = false;

    constructor() {
        super();
        ShoppingCart.addToCartListener(this.handleAddToCart.bind(this));
    }

    handleAddToCart() {
        this.isVisible = true;
        this.addToCartSucceed = true;
        setTimeout(() => {
            this.isVisible = false;
        }, 3000);
    }

    renderedCallback() {
    }
}

export default ToastMessage;
