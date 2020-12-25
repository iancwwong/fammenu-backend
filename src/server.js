const express = require('express');
const mongoose = require('mongoose');
const schema = require('./schemas/schema');
const FoodItems = require('./schemas/foodItem');
const bodyParser = require('body-parser');
const { ApolloServer } = require('apollo-server-express');

// Prepare DB connection
// TODO: 'mongo' is the name of the running docker container... 
// Need to make this configurable, as well as the DB port and server port
const DB_URL = "mongodb://mongo:27017/fammenu"
const dbConnection = mongoose.connect(DB_URL, { useNewUrlParser: true });
dbConnection.then((db) => {
    console.log('Connected successfully to DB!');
}, (err) => {
    console.log(err);
    process.exit(1);
});

// Prepare Apollo GraphQL server
const server = new ApolloServer({
    typeDefs: schema.typeDefs,
    resolvers: schema.resolvers
});

// Prepare server middleware
const app = express();
app.use(bodyParser.json());
server.applyMiddleware({ app });

// Set up routes
app.get('/', (req, res) => {
    res.send("You've just hit the backend server for fammenu");
});

// Run server
const port = 3000;
app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
    console.log(`Consult graphQL playground at: ${server.graphqlPath}`);
});