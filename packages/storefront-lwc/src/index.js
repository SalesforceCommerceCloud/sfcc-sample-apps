import "@lwc/synthetic-shadow";
import { buildCustomElementConstructor } from 'lwc';
import CommerceProductList from 'commerce/productlist';
import CommerceHome from 'commerce/home';
import CommerceLayout from 'commerce/layout';
import CommerceHeader from 'commerce/header';

customElements.define('commerce-productlist', buildCustomElementConstructor(CommerceProductList));
customElements.define('commerce-home', buildCustomElementConstructor(CommerceHome));
customElements.define('commerce-header', buildCustomElementConstructor(CommerceHeader));
customElements.define('commerce-layout', buildCustomElementConstructor(CommerceLayout));