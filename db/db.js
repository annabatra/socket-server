/**
 * Connect to the database and search using a criteria.
 */
"use strict";

// MongoDB
const mongo = require("mongodb").MongoClient;
const dsn =  process.env.DBWEBB_DSN || "mongodb://localhost:27017/chat";

// Express server
const port = process.env.DBWEBB_PORT || 1338;
const express = require("express");
const app = express();



// Just for testing the sever
// app.get("/", (req, res) => {
//     res.send("Hello World");
// });



// Return a JSON object with list of all documents within the collection.
app.get("/list", async (request, response) => {
    try {
        let res = await findInCollection(dsn, "savedmessages", {}, {}, 0);

        console.log(res);
        response.json(res);
    } catch (err) {
        console.log(err);
        response.json(err);
    }
});



// Startup server and liten on port
app.listen(port, () => {
    console.log(`Server is listening on ${port}`);
    console.log(`DSN is: ${dsn}`);
});



/**
 * Find documents in an collection by matching search criteria.
 *
 * @async
 *
 * @param {string} dsn        DSN to connect to database.
 * @param {string} colName    Name of collection.
 * @param {object} criteria   Search criteria.
 * @param {object} projection What to project in results.
 * @param {number} limit      Limit the number of documents to retrieve.
 *
 * @throws Error when database operation fails.
 *
 * @return {Promise<array>} The resultset as an array.
 */

async function findAllCollection(dsn, colName, limit) {
    const client  = await mongo.connect(dsn);
    const db = await client.db();
    const col = await db.collection(colName);
    const res = await col.find().limit(limit).toArray();
    // console.log(res);

    await client.close();

    return res;
}


// lägger till i databasen så det finns som historik
async function addToChatDB(dsn, colName, msg) {
    const client = await mongo.connect(dsn);
    const db = await client.db();
    const col = await db.collection(colName);
    const res = await col.insertOne(msg)

    await client.close();

    return res;
}

module.exports = {
    addToChatDB: addToChatDB,
    findAllCollection: findAllCollection
};
