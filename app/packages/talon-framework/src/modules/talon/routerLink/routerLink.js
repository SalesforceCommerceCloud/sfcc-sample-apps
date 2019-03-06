import { LightningElement, api } from 'lwc';
import { getRouteUrl } from "talon/routingService";

export default class RouterLink extends LightningElement {
    @api route;
    @api label;

    get href() {
        return getRouteUrl(this.route);
    }
}