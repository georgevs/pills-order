class Prescription {
  constructor({ prescription, inventory }) {
    this.id = prescription.id;
    this.items = prescription.items.map(take => new PrescriptionItem({ 
      product: take.product(),
      prescribedDoses: take.prescribedDoses(),
      availableDoses: inventory.get(take.product().id())?.availableDoses() ?? 0,
    }));
  }
}

class PrescriptionItem extends Array {
  constructor({ product, prescribedDoses, availableDoses }) {
    super(product, prescribedDoses, availableDoses);
  }
  product() { return this[0] }
  prescribedDoses() { return this[1] }
  availableDoses() { return this[2] }
}

class Order {
  constructor({ prescription, inventory }) {
    this.id = prescription.id;
    let items = prescription.items.map(take => ({
      product: take.product(),
      dosesPerUnit: take.product().dosesPerUnit(),
      prescribedDoses: take.prescribedDoses(),
      availableDoses: inventory.get(take.product().id())?.availableDoses() ?? 0,
    }));
    const orderUnits = ({ dosesPerUnit, prescribedDoses, availableDoses }) => (
      ((Math.max(0, prescribedDoses - availableDoses) + dosesPerUnit - 1) / dosesPerUnit) | 0
    );
    items = items.map(item => ({ product: item.product, units: orderUnits(item) }));
    items = items.filter(({ units }) => units > 0);
    this.items = items.map(item => new OrderItem(item));
  }
}

class OrderItem extends Array {
  constructor({ product, units }) {
    super(product, units);
  }
  product() { return this[0] }
  units() { return this[1] }
}
