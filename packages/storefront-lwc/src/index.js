import '@lwc/synthetic-shadow';
import { buildCustomElementConstructor } from 'lwc';

import CommerceStoreFront from 'commerce/storeFront';

import { registerWireService } from '@lwc/wire-service';
import { register } from 'lwc';

registerWireService(register);

customElements.define(
    'commerce-store-front',
    buildCustomElementConstructor(CommerceStoreFront),
);
