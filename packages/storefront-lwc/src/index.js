import '@lwc/synthetic-shadow';
import { buildCustomElementConstructor } from 'lwc';

import CommerceStoreFront from 'commerce/storeFront';

customElements.define(
    'commerce-store-front',
    buildCustomElementConstructor(CommerceStoreFront),
);
