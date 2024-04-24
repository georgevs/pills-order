class OrderElement extends HTMLElement {
  static registerCustomElement() {
    OrderElement.table = document.createElement('template');
    OrderElement.table.innerHTML = `
      <style>
        table {
          border-spacing: 0px;
        }
        thead th {
          border-bottom: solid;
        }
        .descr {
          text-align: left;
        }
        .qty {
          text-align: right;
          padding-left: 1em;
        }
      </style>
      <table>
        <thead>
          <tr>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody></tbody>
      </table>
    `;
    OrderElement.row = document.createElement('template');
    OrderElement.row.innerHTML = `
      <tr>
        <td></td>
        <td></td>
      </tr>
    `;
    window.customElements.define('x-order', OrderElement);
  }
  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: 'open' });
    shadowRoot.appendChild(OrderElement.table.content.cloneNode(true));
    this.table = shadowRoot.querySelector('table');
  }

  render({ order }) {
    const header = ['DESCR', 'UQTY'];
    this.renderOrder({ header, order });
    return this;
  }
  renderOrder({ header, order }) {
    if (order) {
      const rows = order.items.map(item => {
        const values = new Map([
          ['DESCR', item.product().description()],
          ['UQTY', item.units()],
        ]);
        const colClassNames = new Map([
          ['UQTY', ['qty']],
        ]);
        const row = OrderElement.row.content.cloneNode(true);
        Array.from(row.querySelectorAll('td'))
          .map((td, colIndex) => [td, values.get(header[colIndex]), colClassNames.get(header[colIndex])])
          .forEach(([td, text, classNames]) => {
            if (classNames) { td.classList.add(...classNames) }
            td.textContent = text;
          });
        return row;
      });
      this.table.tBodies[0].replaceChildren(...rows);
    
      const values = new Map([
        ['DESCR', 'Description'],
        ['UQTY', 'Units'],
      ]);
      const colClassNames = new Map([
        ['DESCR', ['descr']],
        ['UQTY', ['qty']],
      ]);
      Array.from(this.table.tHead.rows[0].cells)
        .map((th, colIndex) => [th, values.get(header[colIndex]), colClassNames.get(header[colIndex])])
        .forEach(([th, text, classNames]) => {
          if (classNames) { th.classList.add(...classNames) }
          th.textContent = text;
        });
    }
  }
}

[OrderElement].forEach(x => x.registerCustomElement());
