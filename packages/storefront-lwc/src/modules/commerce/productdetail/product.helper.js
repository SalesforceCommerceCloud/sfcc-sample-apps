export function canAddToCart(product, quantity) {
    const inventory = product && product.inventory;

    if (!inventory) return false; // not yet loaded

    return (
        variationSelected(product) && inventoryAvailable(inventory, quantity)
    );

    function variationSelected(product) {
        return !product.type.master;
    }

    function inventoryAvailable(inventory, quantity) {
        if (inventory.orderable && inventory.ats >= quantity) return true;
        else if (inventory.backorderable || inventory.preorderable) return true;
        else return false;
    }
}
