# Backend

The backend component of the fammenu project! 

Currently an Apollo Server with a graphql endpoint for the frontend.

## Running notes

Running in dev mode:

`node src/server.js`

Initailise the database (MongoDB running on port 27017):
```
cd data
seed
```

Mess around in the GraphQL playground at /graphql.

Contract of queries and mutations:
<details>
<summary>Contract of queries and mutations</summary>

```
type Query {
    getFoodItemById(id: ID!): FoodItem
    searchFoodItemByJsonString(jsonCriteria: String!): [FoodItem]
    searchFoodItemsByName(nameRegex: String!): [FoodItem]
    searchFoodItemsByLabels(labels: [String!]!): [FoodItem]
    searchFoodItemsByGenericTerm(searchTerm: String!): [FoodItem]
}

type Mutation {
    addFoodItem(name: String!, labels: [String!]!, cuisine: String!): FoodItem
    updateFoodItem(id: ID!, name: String!, labels: [String!]!, cuisine: String!): FoodItem
    deleteFoodItem(id: ID!): FoodItem
}
```
</details>

Some useful queries:
<details>
<summary>View</summary>

```
query {
    getFoodItems {
        id
        name
        labels	
    }
}

query SearchFoodItemsByGenericTerm($searchTerm: String!) {
    searchFoodItemsByGenericTerm(searchTerm:$searchTerm) {
        id
        name
        cuisine
        labels
    }
}
```
</details>