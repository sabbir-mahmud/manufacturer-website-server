/**
 * ------------------------------------------------------------------------
 * imports
 * ------------------------------------------------------------------------
 */
const express = require("express");
const app = express();
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { MongoClient, ServerApiVersion } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();
const stripe = require("stripe")(process.env.PAYMENTS_SECRET_KEY);

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
 * check user access token
 * ------------------------------------------------------------------------
 */

/**
 * ------------------------------------------------------------------------
 * MongoDB Config
 * ------------------------------------------------------------------------
 */

const uri = process.env.DB_URI;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function mikrotik_server() {
  try {
    /**
     * --------------------------------------------------------------------
     * Connect to MongoDB
     * --------------------------------------------------------------------
     */
    await client.connect();
    const productCollection = client.db("mikrotik").collection("products");
    const orders = client.db("mikrotik").collection("orders");
    const reviewCollection = client.db("mikrotik").collection("reviews");
    const users = client.db("mikrotik").collection("users");
    const admins = client.db("mikrotik").collection("admins");
    const profile = client.db("mikrotik").collection("profile");
    const projects = client.db("mikrotik").collection("projects");

    /**
     * ---------------------------------------------------------------
     * Verify admin
     * ---------------------------------------------------------------
     */

    /**
     * --------------------------------------------------------------------
     * root route
     * --------------------------------------------------------------------
     */
    app.get("/", (req, res) => {
      res.send("Welcome to Mikrotik API");
    });

    /**
     * --------------------------------------------------------------------
     * Register user one database and send JWT token generator
     * --------------------------------------------------------------------
     */

    /**
     * --------------------------------------------------------------------
     * Payments
     * --------------------------------------------------------------------
     */

    app.post("/create-payment-intent", verifyUser, async (req, res) => {
      const price = req.body.pay;
      if (price < 999999) {
        const amount = price * 100;
        if (amount) {
          const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: "usd",
            payment_method_types: ["card"],
          });
          if (paymentIntent.client_secret) {
            return res.send({ clientSecret: paymentIntent.client_secret });
          } else {
            return res.send({ clientSecret: "" });
          }
        } else {
          return res.send({ clientSecret: "" });
        }
      } else {
        return res.send({ clientSecret: "" });
      }
    });

    /**
     * --------------------------------------------------------------------
     * Get all users from database for admin
     * --------------------------------------------------------------------
     */

    app.get("/api/users", verifyUser, verifyAdmin, async (req, res) => {
      const adminCollection = await admins.find().toArray();
      const usersCollection = await users.find().toArray();
      usersCollection.forEach((user) => {
        const admin = adminCollection.find(
          (admin) => admin.email === user.email
        );
        if (admin) {
          user.isAdmin = true;
        } else {
          user.isAdmin = false;
        }
      });
      res.send(usersCollection);
    });

    /**
     * --------------------------------------------------------------------
     * remove user from database for admin
     * --------------------------------------------------------------------
     */

    app.delete(
      "/api/admin/users/:id",
      verifyUser,
      verifyAdmin,
      async (req, res) => {
        const id = req.params.id;
        const filter = { _id: ObjectId(id) };
        const result = await users.deleteOne(filter);
        res.send(result);
      }
    );

    /**
     * --------------------------------------------------------------------
     * user profile update
     * --------------------------------------------------------------------
     */

    app.put("/api/users/profile", verifyUser, async (req, res) => {
      const data = req.body;
      const filter = { email: data.email };
      const options = { upsert: true };
      const updateDoc = {
        $set: data,
      };
      const result = await profile.updateOne(filter, updateDoc, options);
      res.send(result);
    });

    /**
     * --------------------------------------------------------------------
     * get user profile
     * --------------------------------------------------------------------
     */

    app.get("/api/users/profile/:email", verifyUser, async (req, res) => {
      const email = req.params.email;
      const result = await profile.findOne({ email });
      if (result) {
        res.send(result);
      } else {
        res.send("User not found");
      }
    });

    /**
     * --------------------------------------------------------------------
     * Make admin
     * --------------------------------------------------------------------
     */

    app.put("/api/admin", verifyUser, verifyAdmin, async (req, res) => {
      const email = req.body.email;
      const role = "admin";
      const filter = { email: email };
      const user = { email, role };
      const options = { upsert: true };
      const updateDoc = {
        $set: user,
      };
      const result = await admins.updateOne(filter, updateDoc, options);
      res.send(result);
    });

    /**
     * --------------------------------------------------------------------
     * Get admin
     * --------------------------------------------------------------------
     */

    app.get("/api/admin", verifyUser, verifyAdmin, async (req, res) => {
      const email = req.query.email;
      const result = await admins.findOne({ email });
      res.send(result);
    });

    /**
     * --------------------------------------------------------------------
     * Get all products public route
     * --------------------------------------------------------------------
     */

    app.get("/api/products", async (req, res) => {
      const products = await productCollection.find({}).toArray();
      res.send(products);
    });

    /**
     * --------------------------------------------------------------------
     * get 3 products public route
     * --------------------------------------------------------------------
     */

    app.get("/api/home/products", async (req, res) => {
      const products = await productCollection
        .find({})
        .sort({ _id: -1 })
        .limit(3)
        .toArray();
      res.send(products);
    });

    /**
     * --------------------------------------------------------------------
     * get product by id public route
     * --------------------------------------------------------------------
     */

    app.get("/api/products/:id", async (req, res) => {
      const id = req.params.id;
      const product = await productCollection.findOne({ _id: ObjectId(id) });
      res.send(product);
    });

    /**
     * --------------------------------------------------------------------
     * add product route for admin
     * --------------------------------------------------------------------
     */

    app.post("/api/products", verifyUser, verifyAdmin, async (req, res) => {
      const product = req.body;
      const result = await productCollection.insertOne(product);
      res.send(result);
    });

    /**
     * --------------------------------------------------------------------
     * update product route for admin
     * --------------------------------------------------------------------
     */

    app.patch(
      "/api/products/:id",
      verifyUser,
      verifyAdmin,
      async (req, res) => {
        const id = req.params.id;
        const product = req.body;
        const filter = { _id: ObjectId(id) };
        const options = { upsert: true };
        const updateDoc = {
          $set: product,
        };
        const productData = await productCollection.findOne(filter);
        if (productData) {
          const result = await productCollection.updateOne(
            filter,
            updateDoc,
            options
          );
          return res.send(result);
        }

        return res.send({ message: "Product not found" });
      }
    );
    /**
     * --------------------------------------------------------------------
     * delete product admin route
     * --------------------------------------------------------------------
     */

    app.delete(
      "/api/products/:id",
      verifyUser,
      verifyAdmin,
      async (req, res) => {
        const product = req.params.id;
        const result = await productCollection.deleteOne({
          _id: ObjectId(product),
        });
        res.send(result);
      }
    );

    /**
     * --------------------------------------------------------------------
     * Order product
     * --------------------------------------------------------------------
     */
    app.post("/api/order", verifyUser, async (req, res) => {
      const order = req.body;
      const product = await productCollection.findOne({
        _id: ObjectId(order?.product),
      });
      if (product) {
        let qtn = parseInt(product?.quantity) - parseInt(order?.quantity);
        const pay = parseFloat(product?.price) * parseInt(order?.quantity);
        if (pay < 999999) {
          order.pay = pay;
          await productCollection.updateOne(
            { _id: ObjectId(order?.product) },
            { $set: { quantity: qtn } }
          );

          const result = await orders.insertOne(order);
          return res.send(result);
        } else {
          return res.send({ message: `you can't order more than $999,999.99` });
        }
      }
      res.send({ message: "Product not found" });
    });

    /**
     * --------------------------------------------------------------------
     * update payments details
     * --------------------------------------------------------------------
     */

    app.patch("/api/order/:id", verifyUser, async (req, res) => {
      const id = req.params.id;
      const payment = req.body;
      const filter = { _id: ObjectId(id) };
      const updatedDoc = {
        $set: {
          paid: true,
          transactionId: payment.transactionId,
        },
      };
      const updatedBooking = await orders.updateOne(filter, updatedDoc);
      res.send(updatedBooking);
    });

    /**
     * --------------------------------------------------------------------
     * get orders by user
     * --------------------------------------------------------------------
     *
     */

    app.get("/api/order", verifyUser, async (req, res) => {
      const email = req.query.email;
      const result = await orders.find({ user: email }).toArray();
      res.send(result);
    });

    /**
     * --------------------------------------------------------------------
     * get order for payment
     * --------------------------------------------------------------------
     */

    app.get("/api/order/:id", verifyUser, async (req, res) => {
      const id = req.params.id;
      const result = await orders.findOne({ _id: ObjectId(id) });
      res.send(result);
    });

    /**
     * --------------------------------------------------------------------
     * Get all orders for admin
     * --------------------------------------------------------------------
     */

    app.get("/api/orders", verifyUser, verifyAdmin, async (req, res) => {
      const result = await orders.find({}).toArray();
      res.send(result);
    });

    /**
     * --------------------------------------------------------------------
     * shipped order admin route
     * --------------------------------------------------------------------
     */

    app.patch(
      "/api/orders/shipped/:id",
      verifyUser,
      verifyAdmin,
      async (req, res) => {
        const id = req.params.id;
        const status = req.body;
        const filter = { _id: ObjectId(id) };
        const updatedDoc = {
          $set: {
            status: status.status,
          },
        };
        const updatedBooking = await orders.updateOne(filter, updatedDoc);
        res.send(updatedBooking);
      }
    );

    /**
     * --------------------------------------------------------------------
     * Delete order admin route
     * --------------------------------------------------------------------
     */

    app.delete("/api/orders/:id", verifyUser, verifyAdmin, async (req, res) => {
      const id = req.params.id;
      const result = await orders.deleteOne({ _id: ObjectId(id) });
      res.send(result);
    });

    /**
     * --------------------------------------------------------------------
     * Delete order user route
     * --------------------------------------------------------------------
     */

    app.delete("/api/user/orders/:id", verifyUser, async (req, res) => {
      const id = req.params.id;
      const result = await orders.deleteOne({ _id: ObjectId(id) });
      res.send(result);
    });

    /**
     * --------------------------------------------------------------------
     * get reviews for homepage
     * --------------------------------------------------------------------
     */

    app.get("/api/home/review", async (req, res) => {
      const reviews = await reviewCollection
        .find({})
        .sort({ _id: -1 })
        .limit(3)
        .toArray();
      res.send(reviews);
    });

    /**
     * --------------------------------------------------------------------
     * add a review
     * --------------------------------------------------------------------
     */

    app.post("/api/review", verifyUser, async (req, res) => {
      const review = req.body;
      const result = await reviewCollection.insertOne(review);
      res.send(result);
    });

    /**
     * --------------------------------------------------------------------
     * Get projects details for portfolio
     * --------------------------------------------------------------------
     */

    app.get("/api/portfolio", async (req, res) => {
      const result = await projects.find({}).toArray();
      res.send(result);
    });
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
});
