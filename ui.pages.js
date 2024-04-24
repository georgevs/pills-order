class NotFoundPage extends HTMLElement {
  static registerCustomElement() {
    NotFoundPage.template = document.querySelector('#page-not-found');
    window.customElements.define('x-page-not-found', NotFoundPage);
  }
  constructor() {
    super();
    const fragment = document.importNode(NotFoundPage.template.content, true);
    this.attachShadow({ mode: 'open' }).appendChild(fragment);
  }
  render() {
    return this;
  }
}

class PrescriptionPage extends HTMLElement {
  static registerCustomElement() {
    PrescriptionPage.template = document.querySelector('#page-prescription');
    window.customElements.define('x-page-prescription', PrescriptionPage);
  }
  constructor() {
    super();
    const fragment = document.importNode(PrescriptionPage.template.content, true);
    this.form = fragment.querySelector('form');
    this.prescription = fragment.querySelector('x-prescription');
    this.attachShadow({ mode: 'open' }).appendChild(fragment);
  }
  render({ onSubmit, ...options}) {
    this.prescription.render(options);
    if (onSubmit !== undefined) {
      function handleSubmit(e) {
        e.preventDefault();
        onSubmit();
      }
      if (this.removeSubmitHandler) { this.removeSubmitHandler() }
      this.removeSubmitHandler = this.form.removeEventListener.bind(this.form, 'submit', handleSubmit);
      this.form.addEventListener('submit', handleSubmit);
    }
    return this;
  }
}

class InventoryPage extends HTMLElement {
  static registerCustomElement() {
    InventoryPage.template = document.querySelector('#page-inventory');
    window.customElements.define('x-page-inventory', InventoryPage);
  }
  constructor() {
    super();
    const fragment = document.importNode(InventoryPage.template.content, true);
    this.form = fragment.querySelector('form');
    this.attachShadow({ mode: 'open' }).appendChild(fragment);
  }
  render({ doses, onSubmit } = {}) {
    if (doses !== undefined) {
      this.form.doses.value = parseInt(doses.toString());
    }
    if (onSubmit !== undefined) {
      function handleSubmit(e) {
        e.preventDefault();
        onSubmit({ doses: parseInt(e.target.doses.value) });
      }
      if (this.removeSubmitHandler) { this.removeSubmitHandler() }
      this.removeSubmitHandler = this.form.removeEventListener.bind(this.form, 'submit', handleSubmit);
      this.form.addEventListener('submit', handleSubmit);
    }
    return this;
  }
}

class OrderPage extends HTMLElement {
  static registerCustomElement() {
    OrderPage.template = document.querySelector('#page-order');
    window.customElements.define('x-page-order', OrderPage);
  }
  constructor() {
    super();
    const fragment = document.importNode(OrderPage.template.content, true);
    this.order = fragment.querySelector('x-order');
    this.attachShadow({ mode: 'open' }).appendChild(fragment);
  }
  render(options) {
    this.order.render(options);
    return this;
  }
}

[NotFoundPage, PrescriptionPage, InventoryPage, OrderPage].forEach(x => x.registerCustomElement());
