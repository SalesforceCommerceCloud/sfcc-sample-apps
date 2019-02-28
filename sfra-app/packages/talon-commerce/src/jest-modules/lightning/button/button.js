import { api } from 'lwc';
import PrimitiveButton from 'lightning/primitiveButton';
import buttonTmpl from './button.html';

export default class LightningButton extends PrimitiveButton {
    @api name;
    @api value;
    @api label;
    @api variant;
    @api iconName;
    @api iconPosition;
    @api type;
    @api id;

    render() {
        return buttonTmpl;
    }
}
