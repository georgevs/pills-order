window.addEventListener('load', () => { (window.app = new App()).init() });

class App {
  constructor() {
    this.services = new Services();

    this.ui = new Ui(document.body);

    const baseUrl = window.location.origin;
    this.router = new Router([
      { pattern: new URLPattern('#prescriptions/:id(\\d+)/inventory/:pid(\\d+)', baseUrl),
        handler: ({ hash: { groups: { id, pid } } }) => { 
          this.renderInventory({ prescriptionId: parseInt(id), productId: parseInt(pid) });
        }
      },
      { pattern: new URLPattern('#prescriptions/:id(\\d+)/order', baseUrl),
        handler: ({ hash: { groups: { id } } }) => { 
          this.renderOrder({ prescriptionId: parseInt(id) });
        }
      },
      { pattern: new URLPattern('#prescriptions/:id(\\d+)', baseUrl),
        handler: ({ hash: { groups: { id } } }) => { 
          this.renderPrescription({ prescriptionId: parseInt(id) });
        }
      },
      { pattern: new URLPattern('*', baseUrl),
        handler: () => { this.router.navigate(new URL('#prescriptions/1', baseUrl)) }  // TODO
      }
    ]);
  }

  async init() {
    await this.services.init();
    this.datasets = await this.fetchDatasets();
    this.router.match({ url: window.location.href, execute: true });
  }

  renderNotFound({ caption = '', message = ''} = {}) {
    const page = this.ui.notFoundPage();
    this.ui.render({ page, caption, message });
  }

  renderInventory({ prescriptionId, productId }) {
    const { products, inventory } = this.datasets; 
    
    const product = products.index.get(productId);
    if (product) {
      const row = inventory.rows.find(row => row.product().id() === product.id());
      const availableDoses = row?.availableDoses() ?? 0;
      const handleSubmit = ({ doses }) => {
        inventory.put({ product, availableDoses: doses });
        inventory.commit({ persist: this.services.inventory.put.bind(this.services.inventory) });
        this.router.navigate(new URL(`#prescriptions/${prescriptionId}`, window.location.origin));
      };
      const page = this.ui.inventoryPage({ doses: availableDoses, onSubmit: handleSubmit });
      this.ui.render({ page, caption: 'Inventory', message: product.description() });

    } else {
      this.renderNotFound({ caption: 'Inventory' });
    }
  }

  renderOrder({ prescriptionId }) {
    const { prescriptions, inventory } = this.datasets; 

    const prescription = prescriptions.index.get(prescriptionId);
    
    if (prescription) {
      const page = this.ui.orderPage({
        order: new Order({ prescription, inventory: inventory.index })
      });
      app.ui.render({ page, caption: 'Order', message: '' });

    } else {
      this.renderNotFound({ caption: `Prescription ${prescriptionId}` });
    }
  }

  renderPrescription({ prescriptionId }) {
    const { prescriptions, inventory } = this.datasets; 

    const prescription = prescriptions.index.get(prescriptionId);
    
    if (prescription) {
      const handleClick = ({ pid }) => {
        this.router.navigate(new URL(`#prescriptions/${prescriptionId}/inventory/${pid}`, window.location.origin));
      };
      const handleSubmit = () => {
        this.router.navigate(new URL(`#prescriptions/${prescriptionId}/order`, window.location.origin));
      };
      const page = this.ui.prescriptionPage({
        prescription: new Prescription({ prescription, inventory: inventory.index }),
        onClick: handleClick,
        onSubmit: handleSubmit
      });
      app.ui.render({ page, caption: `Prescription ${prescriptionId}`, message: '' });

    } else {
      this.renderNotFound({ caption: `Prescription ${prescriptionId}` });
    }
  }

  async fetchDatasets() {
    const [productsValues, prescriptionsValues, inventoryValues] = [
      this.services.products.fetch(),
      this.services.prescriptions.fetch(),
      this.services.inventory.fetch()
    ];

    let products, prescriptions, inventory;
    const errors = [];
    try {
      products = new ProductsDataset({
        schema: Products.schema,
        values: await productsValues
      });
    } catch (error) {
      errors.push(error);
    }
    try {
      prescriptions = new PrescriptionsDataset({
        schema: Prescriptions.schema,
        values: await prescriptionsValues,
        indeces: { products: products.index }
      });
    } catch (error) {
      errors.push(error);
    }
    try {
      inventory = new InventoryDataset({
        schema: Inventory.schema,
        values: await inventoryValues,
        indeces: { products: products.index }
      });
    } catch (error) {
      errors.push(error);
    }

    if (errors.length > 0) {
      const [error] = errors;   // TODO: aggregate error
      return { error };
    }

    return { products, prescriptions, inventory };
  }
}
