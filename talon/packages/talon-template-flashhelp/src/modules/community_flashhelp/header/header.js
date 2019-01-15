import { LightningElement } from 'lwc';
import { navigateToRoute } from "talon/routingService";

export default class Header extends LightningElement {
    handleLogoClick() {
        navigateToRoute('home');
    }
}
