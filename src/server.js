const express = require('express');
const mongoose = require('mongoose');
const schema = require('./schemas/schema');
const bodyParser = require('body-parser');
const { ApolloServer } = require('apollo-server-express');
const conf = require('./conf');

// Prepare DB connection
console.log("Connecting with DB URL: " + conf.DB_URL);
const dbConnection = mongoose.connect(conf.DB_URL, { useNewUrlParser: true });
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
app.listen(conf.APP_PORT, () => {
    console.log(`App listening at http://localhost:${conf.APP_PORT}`);
    console.log(`Consult graphQL playground at: ${server.graphqlPath}`);
});