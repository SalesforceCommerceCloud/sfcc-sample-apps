const variationSelected = product => {
    return !product.type.master;
};

const inventoryAvailable = (inventory, quantity) => {
    if (inventory.orderable && inventory.ats >= quantity) {
        return true;
    } else if (inventory.backorderable || inventory.preorderable) {
        return true;
    }
    return false;
};

export const canAddToBasket = (product, quantity) => {
    const inventory = product && product.inventory;

    if (!inventory) {
        // not yet loaded
        return false;
    }

    return (
        variationSelected(product) && inventoryAvailable(inventory, quantity)
    );
};
