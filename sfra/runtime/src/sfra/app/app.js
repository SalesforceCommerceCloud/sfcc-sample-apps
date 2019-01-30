import { LightningElement, api, buildCustomElementConstructor } from 'lwc'

import { register } from "lwc";
import { registerWireService } from "wire-service";

// register the wire service with the engine
registerWireService(register);

export default class App extends LightningElement {

    @api products = ['11', '12']

    constructor () {
        super()
    }
}

if (typeof customElements !== 'undefined' && customElements) {
    customElements.define('cc-sfra-app', buildCustomElementConstructor(App, {fallback: true}))
}
