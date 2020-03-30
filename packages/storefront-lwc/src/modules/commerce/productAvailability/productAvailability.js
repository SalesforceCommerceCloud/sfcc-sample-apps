import { LightningElement, api } from 'lwc';

export default class ProductAvailability extends LightningElement {
    @api inventory;
    @api type;
    @api quantity;

    /**
     * Checks the availability of a product and returns the appropriate availability message
     */
    get availabilityMessage() {
        // Message that will be returned and displayed
        let availabilityMessage = '';

        // If product is a master product user must select variant for availability
        const isMasterProduct = this.type && this.type.master;
        if (isMasterProduct) {
            availabilityMessage = 'Select Styles for Availability';
            return availabilityMessage;
        }

        // ATS = max(0, allocation + preorderBackorderAllocation - turnover – on-order)
        // A user could select 5 however only 2 are in stock we will want to show if the remaining 3 are on back order or
        // pre-order we will utilize stock level. Stock level is calculated below
        // StockLevel = max(0, allocation - turnover – on-order)

        if (!this.inventory || !this.inventory.ats) {
            availabilityMessage = 'This item is currently not available';
        } else {
            // Check to see if the product has perpetual inventory. OCAPI returns ats with value 9999 if product is infinite
            const isPerpetual =
                this.inventory &&
                this.inventory.ats &&
                this.inventory.ats === 9999;
            if (isPerpetual) {
                availabilityMessage = 'In Stock';
                return availabilityMessage;
            }

            // Could have multiple messages due to availability levels and back order and pre order
            const availabilityMessages = [];
            const inventoryStockLevel = this.inventory.stockLevel
                ? this.inventory.stockLevel
                : 0;
            const allocation = this.inventory.ats - inventoryStockLevel;
            const selectedQuantity = this.quantity ? this.quantity : 1;
            const levels = {
                inStock:
                    selectedQuantity <= inventoryStockLevel
                        ? selectedQuantity
                        : inventoryStockLevel,
                preorder: 0,
                backorder: 0,
                notAvailable: 0,
            };
            let selectedQuantityLeft =
                selectedQuantity <= inventoryStockLevel
                    ? 0
                    : selectedQuantity - inventoryStockLevel;

            // Determine backorder levels
            if (selectedQuantityLeft && this.inventory.backorderable) {
                if (selectedQuantityLeft <= allocation) {
                    levels.backorder = selectedQuantityLeft;
                    selectedQuantityLeft = 0;
                } else {
                    levels.backorder = allocation;
                    selectedQuantityLeft -= allocation;
                }
            }

            // Determine pre-order levels
            if (selectedQuantityLeft && this.inventory.preorderable) {
                if (selectedQuantityLeft <= allocation) {
                    levels.preorder = selectedQuantityLeft;
                    selectedQuantityLeft = 0;
                } else {
                    levels.preorder = allocation;
                    selectedQuantityLeft -= allocation;
                }
            }

            levels.notAvailable = selectedQuantityLeft;

            // Determine the availability message
            if (levels.inStock > 0) {
                if (levels.inStock === selectedQuantity) {
                    availabilityMessages.push('In Stock');
                } else {
                    availabilityMessages.push(
                        levels.inStock + ' Item(s) In Stock.',
                    );
                }
            }

            if (levels.preorder > 0) {
                if (levels.preorder === selectedQuantity) {
                    availabilityMessages.push('Pre-Order');
                } else if (levels.notAvailable === 0) {
                    availabilityMessages.push(
                        'The remaining items are available for pre-order.',
                    );
                } else {
                    availabilityMessages.push(
                        levels.preorder +
                            ' Item(s) are available for pre-order.',
                    );
                }
            }

            if (levels.backorder > 0) {
                if (levels.backorder === selectedQuantity) {
                    availabilityMessages.push('Back Order');
                } else if (levels.notAvailable === 0) {
                    availabilityMessages.push(
                        'The remaining items are available on back order.',
                    );
                } else {
                    availabilityMessages.push(
                        'Back Order' + levels.backorder + ' item(s).',
                    );
                }
            }

            if (levels.notAvailable > 0) {
                if (levels.notAvailable === selectedQuantity) {
                    availabilityMessages.push(
                        'This item is currently not available',
                    );
                } else {
                    availabilityMessages.push(
                        'The remaining items are currently not available. Please adjust the quantity.',
                    );
                }
            }

            availabilityMessage = availabilityMessages.join('\n');
        }

        if (!availabilityMessage) {
            availabilityMessage = 'Select Styles for Availability';
        }

        return availabilityMessage;
    }
    /**
     * Sets the context value to one of the valid values
     * The context value is used as class name in the template.
     * This allows context-specific css styling.
     */
    @api
    set context(value) {
        const validValues = ['pdp', 'basket'];
        let matchFound = false;
        validValues.find(validValue => {
            if (value === validValue) {
                return (matchFound = true);
            }
        });

        if (!matchFound) {
            throw new Error(
                `Invalid context value: ${value}. Available contexts: ${validValues.join(
                    ', ',
                )}`,
            );
        }

        this.contextValue = value;
    }

    /**
     * Gets the context value.
     * The context value is used as class name in the template.
     * This allows context-specific css styling.
     */
    get context() {
        return this.contextValue;
    }
}
