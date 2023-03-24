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
