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
        const orders = client.db('mikrotik').collection('orders');
        const reviewCollection = client.db('mikrotik').collection('reviews');
        const users = client.db('mikrotik').collection('users');
        const admins = client.db('mikrotik').collection('admins');
        const profile = client.db('mikrotik').collection('profile');

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
         * Register user one database and send JWT token generator
         * --------------------------------------------------------------------
         */

        app.put('/api/login', async (req, res) => {
            const email = req.body.email;
            const role = 'client';
            const filter = { email: email };
            const user = { email };
            const options = { upsert: true };
            const updateDoc = {
                $set: user,
            };
            const result = await users.updateOne(filter, updateDoc, options);
            const accessToken = jwt.sign({ email: email }, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: '3d'
            });
            res.send({ result, accessToken });
        })

        /**
         * --------------------------------------------------------------------
         * Get all users from database for admin
         * --------------------------------------------------------------------
         */

        app.get('/api/users', async (req, res) => {
            const result = await users.find().toArray();
            res.send(result);

        })

        /**
         * --------------------------------------------------------------------
         * user profile update
         * --------------------------------------------------------------------
         */

        app.put('/api/users/profile', async (req, res) => {
            const data = req.body;
            console.log(data);
            const filter = { email: data.email };
            const options = { upsert: true };
            const updateDoc = {
                $set: data,
            }
            const result = await profile.updateOne(filter, updateDoc, options);
            res.send(result);
        })

        /**
         * --------------------------------------------------------------------
         * get user profile
         * --------------------------------------------------------------------
         */

        app.get('/api/users/profile/:email', async (req, res) => {
            const email = req.params.email;
            const result = await profile.findOne({ email });
            if (result) {
                res.send(result);
            }
            else {
                res.send('User not found');
            }


        })

        /**
         * --------------------------------------------------------------------
         * Make admin
         * --------------------------------------------------------------------
         */

        app.put('/api/admin', async (req, res) => {
            const email = req.body.email;
            const role = 'admin';
            const filter = { email: email };
            const user = { email, role };
            const options = { upsert: true };
            const updateDoc = {
                $set: user,
            };
            const result = await admins.updateOne(filter, updateDoc, options);
            res.send(result);
        })

        /**
         * --------------------------------------------------------------------
         * Get admin
         * --------------------------------------------------------------------
         */

        app.get('/api/admin', async (req, res) => {
            const email = req.query.email
            const result = await admins.findOne({ email });
            res.send(result);
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
            let qtn = parseInt(product?.Quantity) - parseInt(order?.quantity);
            await productCollection.updateOne({ _id: ObjectId(order?.product) }, { $set: { Quantity: JSON.stringify(qtn) } });
            const result = await orders.insertOne(order);
            res.send(result);
        })

        /**
         * --------------------------------------------------------------------
         * get orders by user
         * --------------------------------------------------------------------
         * 
         */

        app.get('/api/order', async (req, res) => {
            const email = req.query.email;
            const result = await orders.find({ user: email }).toArray();
            res.send(result);
        })


        /**
         * --------------------------------------------------------------------
         * get reviews for homepage
         * --------------------------------------------------------------------
         */

        app.get('/api/home/review', async (req, res) => {
            const reviews = await reviewCollection.find({}).sort({ _id: -1 }).limit(3).toArray();
            res.send(reviews);
        })

        /**
         * --------------------------------------------------------------------
         * add a review
         * --------------------------------------------------------------------
         */

        app.post('/api/review', async (req, res) => {
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            res.send(result);
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