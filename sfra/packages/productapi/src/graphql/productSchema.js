export const schema = `
    type Query {
        product(id: String!): Product
    }

    type Product {
        id: String!
        name: String!
    }
`;