/**
 * ------------------------------------------------------------------------
 * imports
 * ------------------------------------------------------------------------
 */
const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
const port = process.env.PORT || 5000;

/**
 * ------------------------------------------------------------------------
 * Middleware
 * ------------------------------------------------------------------------
 */
app.use(express.json());
app.use(cors());



/**
 * ------------------------------------------------------------------------
 * MongoDB Config
 * ------------------------------------------------------------------------
 */


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@nodedb.scooa.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function mikrotik_server() {
    try {
        /**
         * --------------------------------------------------------------------
         * Connect to MongoDB
         * --------------------------------------------------------------------
         */
        await client.connect();
        const productCollection = client.db('mikrotik').collection('products');

        /**
         * --------------------------------------------------------------------
         * root route
         * --------------------------------------------------------------------
         */
        app.get('/', (req, res) => {
            res.send('Welcome to Mikrotik API');
        })

        /**
         * --------------------------------------------------------------------
         * Get all products
         * --------------------------------------------------------------------
         */

        app.get('/api/products', async (req, res) => {
            const products = await productCollection.find({}).toArray();
            res.send(products);
        })

        /**
         * --------------------------------------------------------------------
         * get 3 products
         * --------------------------------------------------------------------
         */

        app.get('/api/home/products', async (req, res) => {
            const products = await productCollection.find({}).limit(3).toArray();
            res.send(products);
        })



    } finally {
        /**
         * ---------------------------------------------------------------------
         * MongoDb Connection closed
         * ---------------------------------------------------------------------
         */
        // client.close();
    }
}

/**
 * ------------------------------------------------------------------------
 * Running the server
 * ------------------------------------------------------------------------
 */

mikrotik_server().catch(console.dir);


/**
 * ------------------------------------------------------------------------
 * listen to port
 * ------------------------------------------------------------------------
 */

app.listen(port, () => {
    console.log(`Mikrotik Server is running on port ${port}`);
})