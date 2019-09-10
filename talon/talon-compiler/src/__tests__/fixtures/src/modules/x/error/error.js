import { LightningElement } from 'lwc';
import errorLabel from '@salesforce/label/error.errorOccured';

export default class Error extends LightningElement {
    get title() {
        return errorLabel;
    }
}