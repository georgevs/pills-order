class Ui {
  constructor(el) {
    this.caption = el.querySelector('.caption');
    this.message = el.querySelector('p.message');
    this.page = el.querySelector('main section.page');
  }

  notFoundPage(options) {
    this.notFound ||= document.createElement('x-page-not-found');
    return this.notFound.render(options);
  }

  prescriptionPage(options) {
    this.prescription ||= document.createElement('x-page-prescription');
    return this.prescription.render(options);
  }

  inventoryPage(options) {
    app.ui.inventory ||= document.createElement('x-page-inventory');
    return app.ui.inventory.render(options);
  }

  orderPage(options) {
    this.order ||= document.createElement('x-page-order');
    return this.order.render(options);
  }

  render({ caption, message, page }) {
    if (caption !== undefined) {
      const text = caption.toString();
      this.caption.textContent = text;
      this.caption.classList.toggle('d-none', text === '');
    }
    if (message !== undefined) {
      const text = message.toString();
      this.message.textContent = text;
      this.message.classList.toggle('d-none', text === '');
    }
    if (page !== undefined) {
      const children = [page].filter(Boolean);
      this.page.replaceChildren(...children);
      this.page.classList.toggle('d-none', children.length === 0);
    }
  }
}
