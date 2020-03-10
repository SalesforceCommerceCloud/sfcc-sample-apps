import '@lwc/synthetic-shadow';
import { buildCustomElementConstructor } from 'lwc';

import CommerceProductSearchResults from 'commerce/productSearchResults';
import CommerceHome from 'commerce/home';
import CommerceLayout from 'commerce/layout';
import CommerceHeader from 'commerce/header';
import CommerceProductDetail from 'commerce/productDetail';
import CommerceBasket from 'commerce/basket';

import { registerWireService } from '@lwc/wire-service';
import { register } from 'lwc';

registerWireService(register);

customElements.define(
    'commerce-home',
    buildCustomElementConstructor(CommerceHome),
);
customElements.define(
    'commerce-product-search-results',
    buildCustomElementConstructor(CommerceProductSearchResults),
);
customElements.define(
    'commerce-product-detail',
    buildCustomElementConstructor(CommerceProductDetail),
);
customElements.define(
    'commerce-header',
    buildCustomElementConstructor(CommerceHeader),
);
customElements.define(
    'commerce-layout',
    buildCustomElementConstructor(CommerceLayout),
);
customElements.define(
    'commerce-basket',
    buildCustomElementConstructor(CommerceBasket),
);
