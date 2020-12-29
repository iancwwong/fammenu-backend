// This is where the GraphQL API is maintained

const { gql } = require('apollo-server-express');
const { DateResolver, JSONResolver } = require('graphql-scalars');
const FoodItem = require('./foodItem');

// Define GraphQL types and field resolvers
// Question: Why is the following declared as a string, but not resolvers??
const allTypeDefs = gql `

    scalar Date
    scalar JSON

    type FoodItem {
        id: ID!
        name: String!
        labels: [String!]!
        cuisine: String
        chosenDates: [Date!]!
    }

    type Query {
        getFoodItemById(id: ID!): FoodItem
        searchFoodItemByJsonString(jsonCriteria: String!): [FoodItem]
        searchFoodItemsByName(nameRegex: String!): [FoodItem]
        searchFoodItemsByLabels(labels: [String!]!): [FoodItem]
        searchFoodItemsByGenericTerm(searchTerm: String!): [FoodItem]
    }

    type Mutation {
        addFoodItem(name: String!, labels: [String!]!, cuisine: String): FoodItem
        updateFoodItem(id: ID!, name: String!, labels: [String!]!, cuisine: String!): FoodItem
        deleteFoodItem(id: ID!): FoodItem
    }

`
const allResolvers = {

    Date: DateResolver,
    JSON: JSONResolver,

    // Query resolvers for the FoodItem object
    Query: {
        getFoodItemById: (parent, args) => {
            return FoodItem.findById(args.id);
        },
        searchFoodItemByJsonString: (parent, args) => {
            if (!args.jsonCriteria) return FoodItem.find({});
            else {
                return FoodItem.find(JSON.parse(args.jsonCriteria));
            }
        },

        // searchFoodItemsByName(nameRegex: String!): [FoodItem]
        searchFoodItemsByName: (parent, args) => {
            if (!args.nameRegex) return FoodItem.find({});
            else {
                return FoodItem.find({
                    "name": { $regex: new RegExp(args.nameRegex), $options: 'i' }
                })
            }
        },

        // searchFoodItemsByLabels(labels: [String!]!): [FoodItem]
        searchFoodItemsByLabels: (parent, args) => {
            if (!args.labels || args.labels.length == 0) return FoodItem.find({});
            else {
                return FoodItem.find({ 
                    labels: {
                        $all: args.labels 
                    }
                });
            }
        },

        // Allow generic search (by regex) over multiple fields by a single term
        // Currently searches name and labels
        // searchFoodItemsByGenericTerm(searchTerm: String!): [FoodItem]
        searchFoodItemsByGenericTerm: (parent, args) => {
            if (!args.searchTerm) return FoodItem.find({});
            return FoodItem.find({
                $or: [
                    {
                        "name": { 
                            $regex: new RegExp(args.searchTerm), 
                            $options: 'i' 
                        }
                    },
                    {
                        "labels": {
                            $elemMatch: {
                                $regex: new RegExp(args.searchTerm),
                                $options: 'i'
                            }
                        }
                    },
                    {
                        "cuisine": {
                            $regex: new RegExp(args.searchTerm),
                            $options: 'i'
                        }
                    }
                ]
            });
        }
    },

    // Mutation resolvers for FoodItem object
    Mutation: {
        addFoodItem: (parent, args) => {
            let newFoodItem = new FoodItem({
                name: args.name,
                labels: args.labels,
                cuisine: args.cuisine,
                chosenDates: []
            });
            return newFoodItem.save();
        },

        updateFoodItem: (parent, args) => {
            if (!args.id) {
                console.warn('ID not supplied in FoodItem update query.');
                return;
            }

            // Mongoose magic for updating
            return FoodItem.findOneAndUpdate(
                { _id: args.id },
                {
                    $set: {
                        name: args.name,
                        cuisine: args.cuisine,
                        labels: args.labels
                    }
                }, {new: true}, (err, FoodItem) => {
                    if (err) console.error('Error with updating food item (' + args.id + '):' + err);
                    else console.log('Successfully updated Food item: ' + args.id);
                }
            );
        },

        deleteFoodItem: (parent, args) => {
            if (!args.id) {
                console.warn('ID not supplied in FoodItem delete query.');
                return;
            }

            // Mongoose magic for deleting
            return FoodItem.findByIdAndDelete(args.id, (err) => {
                    if (err) console.error('Error deleting food item (' + args.id + '): ' + err);
                    else console.log('Successfully deleted Food item: ' + args.id);
                }
            );
        }
    }
}


// -------------------
module.exports = {
    typeDefs: allTypeDefs,
    resolvers: allResolvers
}