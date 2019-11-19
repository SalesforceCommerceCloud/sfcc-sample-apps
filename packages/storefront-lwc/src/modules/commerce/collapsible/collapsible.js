import { LightningElement, api, track } from 'lwc'

export default class CollapsibleContent extends LightningElement {
  @track titleContent;
  @track titleTitle;

  @api get content() {
    return this._collapsibleContent;
  };

  set content(value) {
    this.titleContent = value;
    return this._collapsibleContent = value;
  };

  @api get title() {
    return this._title;
  };

  set title(value) {
    this.titleTitle = value;
    return this._title = value;
  };

  constructor() {
      super();
  }

  toggledropdown(event) {
    const toggleButton = event.target;
    const divCard = event.target.parentElement.parentElement;
    const divCollapse = divCard.children[1];

    if (divCollapse.classList.contains('show')) {
      divCollapse.classList.remove('show');
      toggleButton.classList.remove('active');
      toggleButton.setAttribute("aria-expanded", false);
    } else {
      divCollapse.classList.add('show');
      toggleButton.classList.add('active');
      toggleButton.setAttribute("aria-expanded", true);
    }
  }

  renderedCallback() {
    this.template.querySelector('.card-header h4').innerHTML = this.title ? this.title : '';
    this.template.querySelector('.card-body').innerHTML = this.content ? this.content : '';
  }
}