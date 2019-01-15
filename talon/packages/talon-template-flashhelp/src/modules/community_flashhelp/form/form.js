import { LightningElement, track } from 'lwc';
import { getBasePath } from "talon/configProvider";
import { navigateToRoute } from "talon/routingService";
import emailLabel from '@salesforce/label/Global_Address.email';

export default class Form extends LightningElement {
    @track state = {
        errors: {
            "requiredName": false,
            "requiredAddress": false,
            "requiredPhone": false,
            "invalidPhone": false,
            "requiredEmail": false,
            "invalidEmail": false
        }
    };

    @track
    residenceDamagedOptions = [
        {'label': 'Yes', 'value': 'true'},
        {'label': 'No', 'value': 'false'},
    ];

    @track
    displacedOptions = [
        {'label': 'Yes', 'value': 'true'},
        {'label': 'No', 'value': 'false'},
    ];

    @track
    assistanceOptions = [
        {'label': 'Yes', 'value': 'true'},
        {'label': 'No', 'value': 'false'},
    ];

    labels = {
        email: emailLabel
    };

    constructor() {
        super();
        this.emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    }

    onSubmit() {
        if (this.validate()) {
            const data = this.getFormData();
            this.submit(data);
        }
    }

    validate() {
        return this.template.querySelector('.immediate-assistance-name').checkValidity() &&
            this.template.querySelector('.immediate-assistance-address').checkValidity() &&
            this.template.querySelector('.immediate-assistance-telephone').checkValidity() &&
            this.template.querySelector('.immediate-assistance-email').checkValidity();
    }

    submit(data) {
        fetch(getBasePath() + '/services/apexrest/redcross', {
            body: JSON.stringify(data),
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {
                'content-type': 'application/json'
            },
            method: 'POST'
            })
        .then(() => {
            navigateToRoute('confirmation');
        });
    }

    getFormData() {
        const formData = {};

        // name
        const nameField = this.template.querySelector('.immediate-assistance-name');
        formData.name = nameField.value;

        // address
        const addressField = this.template.querySelector('.immediate-assistance-address');
        formData.street = addressField.street;
        formData.zip = addressField.postalCode;
        formData.city = addressField.city;
        formData.country = addressField.country;
        formData.province = addressField.province;

        // phone num
        const phoneField = this.template.querySelector('.immediate-assistance-telephone');
        formData.phone = phoneField.value;

        // email
        const emailField = this.template.querySelector('.immediate-assistance-email');
        formData.email = emailField.value;

        // was your primary residence damaged?
        const damagedRadio = this.template.querySelector('.immediate-assistance-residence-damaged');
        formData.damaged = damagedRadio.value;

        // Were you displaced by the impact of Hurricane Harvey?
        const displacedRadio = this.template.querySelector('.immediate-assistance-displaced');
        formData.displaced = displacedRadio.value;

        // do you need financial assistance?
        const assistanceRadio = this.template.querySelector('.immediate-assistance-assistance');
        formData.assistance = assistanceRadio.value;

        return formData;
    }
}
