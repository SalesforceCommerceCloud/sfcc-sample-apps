import { LightningElement } from 'lwc';
import welcomeLabel from '@salesforce/label/home.welcome';
import 'lightning/configProvider';

export default class Home extends LightningElement {
    get title() {
        return welcomeLabel;
    }
}