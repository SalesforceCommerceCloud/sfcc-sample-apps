import gql from 'graphql-tag';

const QUERY = gql`
    query($query: String!, $filters: [Filter]) {
        productSearch(query: $query, filterParams: $filters) {
            productHits {
                productId
                productName
                prices {
                    sale
                    list
                }
                image {
                    title
                    link
                    alt
                }
                colorSwatches {
                    name
                    value
                    title
                    link
                    alt
                    style
                }
            }
            refinements {
                values {
                    label
                    value
                    hitCount
                    values {
                        label
                        value
                        hitCount
                    }
                }
                label
                attributeId
            }
            currentFilters {
                id
                value
            }
        }
    }
`;

export default QUERY;
