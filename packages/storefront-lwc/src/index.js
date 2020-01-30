import "@lwc/synthetic-shadow";
import { buildCustomElementConstructor } from "lwc";

import CommerceProductSearchResults from "commerce/productSearchResults";
import CommerceHome from "commerce/home";
import CommerceLayout from "commerce/layout";
import CommerceHeader from "commerce/header";
import CommerceCart from "commerce/cart";
import CommerceProductDetail from 'commerce/productdetail'

import { registerWireService } from '@lwc/wire-service';
import { register } from 'lwc'

registerWireService(register);

customElements.define(
    "commerce-home",
    buildCustomElementConstructor(CommerceHome)
);
customElements.define(
    "commerce-product-search-results",
    buildCustomElementConstructor(CommerceProductSearchResults)
);
customElements.define(
    "commerce-productdetail",
    buildCustomElementConstructor(CommerceProductDetail)
);
customElements.define(
    "commerce-cart",
    buildCustomElementConstructor(CommerceCart)
);
customElements.define(
    "commerce-header",
    buildCustomElementConstructor(CommerceHeader)
);
customElements.define(
    "commerce-layout",
    buildCustomElementConstructor(CommerceLayout)
);
