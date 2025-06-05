const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6gfue.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

// Move middleware setup before routes
app.use(cors());
app.use(express.json());

async function run() {
    try {
        // Connect the client to the server
        await client.connect();

        const serviceCollection = client.db('Car-Doctor').collection('Services');
        const productsCollection = client.db('Car-Doctor').collection('Products');
        const customerReviews = client.db('Car-Doctor').collection('customer_reviews');
        const orderCollection = client.db('Car-Doctor').collection('orders');

        // Get all car services
        app.get('/services', async (req, res) => {
            const cursor = serviceCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        });

        app.get('/products', async (req, res) => {
            const cursor = productsCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        });

        app.get('/customer_reviews', async (req, res) => {
            const cursor = customerReviews.find();
            const result = await cursor.toArray();
            res.send(result);
        });

        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };

            const result = await serviceCollection.findOne(query);
            res.send(result);
        });

        app.get('/orders', async (req, res) => {
            const result = await orderCollection.find().toArray();
            res.send(result);
        })

        app.post('/orders', async (req, res) => {
            const order = req.body;
            console.log(order);
            const result = await orderCollection.insertOne(order);
            res.send(result);
        });

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
    }
    finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('server is running!');
});

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});