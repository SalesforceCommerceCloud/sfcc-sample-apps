import { Product as ProductSDK, VariationAttribute, VariationAttributeValue } from 'commerce-sdk/dist/product/products/products.types';
import Image from './Image';
import _ from 'lodash';

type ImagesCallback = (options: { allImages: any[]; size: string }) => Image[];
type VariantsCallback = () => ProductSDK['variants'];
type VariationAttributesCallback = () => {
    variationAttributeType: { id: string; name: string };
    variationAttributeValues: {
        name: string;
        value: string;
        orderable: boolean;
        swatchImage?: Image;
    }[];
};

function getImages(
    imageGroups: any[] = [],
    matchingColor?: string,
): ImagesCallback {
    return ({ allImages, size }) => {
        let result = new Map();

        const isImage = (url: string) => {
            return url && url.match(/\.(jpeg|jpg|gif|png)$/) != null;
        };

        // Return all images if allImages and all sizes asked for
        if (allImages && size === 'all') {
            imageGroups.forEach(imageGroup => {
                imageGroup.images.forEach((image: ProductSDK['image']) => {
                    // ensure unique image being returned
                    if (isImage(image?.link) && !result.has(image?.link)) {
                        result.set(image?.link, new Image(image));
                    }
                });
            });
        } else {
            // Find images of the size requested (default large)
            let sizeImages: Array<ProductSDK['image']> = [];
            imageGroups.forEach(imageGroup => {
                if (imageGroup.viewType === size) {
                    // If there is no matching color defined, take all images.
                    // If there is matching color defined, only take images for that color.
                    if (!matchingColor) {
                        sizeImages = sizeImages.concat(imageGroup.images);
                    } else {
                        if (
                            imageGroup.variationAttributes &&
                            imageGroup.variationAttributes.length > 0
                        ) {
                            for (let variantionAttribute of imageGroup.variationAttributes) {
                                if (
                                    variantionAttribute.id === 'color' &&
                                    variantionAttribute.values[0].value ===
                                        matchingColor
                                ) {
                                    sizeImages = sizeImages.concat(
                                        imageGroup.images,
                                    );
                                    break;
                                }
                            }
                        }
                    }
                }
            });

            // Return all of this size when all images are requested
            if (allImages) {
                sizeImages.forEach((image: ProductSDK['image']) => {
                    // ensure unique image being returned
                    if (isImage(image?.link) && !result.has(image?.link)) {
                        result.set(image?.link, new Image(image));
                    }
                });
            } else {
                // Only first of the size requested when all images false
                result.set(sizeImages?.[0]?.link, new Image(sizeImages[0]));
            }
        }

        return Array.from(result.values());
    };
}

function getVariants(variants: ProductSDK['variants'] = []): VariantsCallback {
    return () => {
        // @todo - switch to an actual Variant model provided by the SDK
        return variants.map((variant: any) => {
            return {
                id: variant.productId,
                variationValues: Object.keys(variant.variationValues).map(
                    key => {
                        return {
                            key: key,
                            value: variant.variationValues[key],
                        };
                    },
                ),
            };
        });
    };
}

const getVariationAttributes = (
    variationAttributes: VariationAttribute[],
    imageGroups: {
        images: any[]; // @todo switch these models to be from the SDK
        viewType: string;
        variationAttributes: { values: { value: string }[] }[];
    }[],
) => {
    return () => {
        return variationAttributes.map(variationAttribute => {
            return {
                variationAttributeType: {
                    id: variationAttribute.id,
                    name: variationAttribute.name,
                },
                variationAttributeValues: (variationAttribute.values as VariationAttributeValue[])?.map(
                    variationAttributeValue => {
                        let swatchImage = imageGroups.find(imageGroup => {
                            if (imageGroup.variationAttributes) {
                                return (
                                    imageGroup.viewType === 'swatch' &&
                                    imageGroup.variationAttributes[0].values[0]
                                        .value === variationAttributeValue.value
                                );
                            } else {
                                return false;
                            }
                        });
                        return {
                            name: variationAttributeValue.name,
                            value: variationAttributeValue.value,
                            orderable: variationAttributeValue.orderable,
                            swatchImage: swatchImage
                                ? new Image(swatchImage.images[0])
                                : null,
                        };
                    },
                ),
            };
        });
    };
};

const getLowestPromotionalPrice = (
    promotions: { promotionalPrice: number }[],
) => {
    if (promotions && promotions.length) {
        let lowestPrice = promotions.reduce(
            function(prev, curr) {
                if (prev && curr) {
                    if (prev.promotionalPrice && curr.promotionalPrice) {
                        return prev.promotionalPrice < curr.promotionalPrice
                            ? prev
                            : curr;
                    } else if (
                        !prev.promotionalPrice &&
                        curr.promotionalPrice
                    ) {
                        return curr;
                    } else if (
                        prev.promotionalPrice &&
                        !curr.promotionalPrice
                    ) {
                        return prev;
                    } else {
                        return { promotionalPrice: -1 };
                    }
                } else if (prev && !curr) {
                    return prev;
                } else if (!prev && curr) {
                    return curr;
                } else {
                    return { promotionalPrice: -1 };
                }
            },
            { promotionalPrice: -1 },
        );

        return lowestPrice.promotionalPrice !== -1 &&
            lowestPrice.promotionalPrice
            ? lowestPrice.promotionalPrice.toFixed(2)
            : null;
    }

    return null;
};

const getPrices = (apiProduct: ProductSDK) => {
    let prices = {
        sale: apiProduct.price,
        list: null,
    };
    if (apiProduct.prices) {
        let lowestPromotionalPrice = getLowestPromotionalPrice(
            apiProduct.productPromotions,
        );
        prices.sale = lowestPromotionalPrice
            ? lowestPromotionalPrice
            : apiProduct.prices['usd-m-sale-prices'];
        prices.list = apiProduct.prices['usd-m-list-prices'];
        if (prices.sale === prices.list) {
            prices.list = null;
        }
    }
    return prices;
};

class Product {
    id: ProductSDK['id'];
    name: ProductSDK['name'];
    masterId: string | undefined;
    price: ProductSDK['price'];
    images: ImagesCallback;
    longDescription: ProductSDK['longDescription'];
    shortDescription: ProductSDK['shortDescription'];
    image: string;
    variants: VariantsCallback;
    prices: { sale: any; list?: any };
    variationAttributes: VariationAttributesCallback;

    constructor(apiProduct: ProductSDK, userSelectedColor: string) {
        this.id = apiProduct.id;
        this.name = apiProduct.name;
        this.masterId = apiProduct?.master?.masterId;
        this.price = apiProduct.price;

        let selectedColor =
            userSelectedColor !== 'undefined' && userSelectedColor !== 'null'
                ? userSelectedColor
                : undefined;
        this.images = getImages(apiProduct.imageGroups, selectedColor);

        Object.assign(this, apiProduct);
        this.longDescription = apiProduct.longDescription;
        this.shortDescription = apiProduct.shortDescription;

        // Set a default image
        this.image = _.get(apiProduct, 'this.images[0].link');

        this.variants = getVariants(apiProduct.variants);
        this.variationAttributes = getVariationAttributes(
            apiProduct.variationAttributes,
            apiProduct.imageGroups,
        );
        this.prices = getPrices(apiProduct);
    }
}

export default Product;
