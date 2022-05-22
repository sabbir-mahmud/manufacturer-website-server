/**
 * ------------------------------------------------------------------------
 * imports
 * ------------------------------------------------------------------------
 */
const express = require('express');
const app = express();
const cors = require('cors');
const jwt = require('jsonwebtoken');
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
        const reviewCollection = client.db('mikrotik').collection('reviews');
        const users = client.db('mikrotik').collection('users');
        const orders = client.db('mikrotik').collection('orders');

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
         * JWT token generator
         * --------------------------------------------------------------------
         */

        app.put('/api/login', async (req, res) => {
            const email = req.body.email;
            const role = 'client';
            const user = { email, role }
            const result = await users.insertOne(user);
            const accessToken = jwt.sign(user, process.env.JWT_SECRET, {
                expiresIn: '3d'
            });
            res.send({ result, accessToken });

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
            const products = await productCollection.find({}).sort({ _id: -1 }).limit(3).toArray();
            res.send(products);
        })

        /**
         * --------------------------------------------------------------------
         * get product by id
         * --------------------------------------------------------------------
         */

        app.get('/api/products/:id', async (req, res) => {
            const id = req.params.id;
            const product = await productCollection.findOne({ _id: ObjectId(id) });
            res.send(product);
        })


        /**
         * --------------------------------------------------------------------
         * add product
         * --------------------------------------------------------------------
         */

        app.post('/api/products', async (req, res) => {
            const product = req.body;
            const result = await productCollection.insertOne(product);
            res.send(result);
        })

        /**
         * --------------------------------------------------------------------
         * Order product
         * --------------------------------------------------------------------
         */
        app.post('/api/order', async (req, res) => {
            const order = req.body;
            const product = await productCollection.findOne({ _id: ObjectId(order?.product) })
            console.log(product);
            let qtn = parseInt(product?.Quantity) - parseInt(order?.quantity);
            console.log(qtn);
            await productCollection.updateOne({ _id: ObjectId(order?.product) }, { $set: { Quantity: JSON.stringify(qtn) } });
            const result = await orders.insertOne(order);
            res.send(result);
        })


        /**
         * --------------------------------------------------------------------
         * get reviews for homepage
         * --------------------------------------------------------------------
         */

        app.get('/api/home/review', async (req, res) => {
            const reviews = await reviewCollection.find({}).limit(3).toArray();
            res.send(reviews);
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