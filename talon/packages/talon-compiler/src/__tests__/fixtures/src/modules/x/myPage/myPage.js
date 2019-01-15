import { LightningElement } from 'lwc';
import title from '@salesforce/label/myPage.title';

export default class Home extends LightningElement {
    get title() {
        return title;
    }
}