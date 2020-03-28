import gql from 'graphql-tag';

const QUERY = gql`
    query($query: String!, $offset: Int!, $limit: Int!, $filters: [Filter]) {
        productSearch(
            query: $query
            offset: $offset
            limit: $limit
            filterParams: $filters
        ) {
            total
            offset
            limit
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
            sortingOptions {
                id
                label
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
