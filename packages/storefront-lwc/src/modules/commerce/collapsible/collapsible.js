import { LightningElement, api } from 'lwc'

export default class CollapsibleContent extends LightningElement {
  @api collapsibleTitle;
  @api collapsibleContent;

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
  }
}