const express = require('express');
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express()




//middleware
app.use(cors());
app.use(express.json());



//const uri = `mongodb+srv://${process.env.S3_BUCKET}:${process.env.SECRET_KEY}@cluster0.mp3wx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const uri = `mongodb://${process.env.S3_BUCKET}:${process.env.SECRET_KEY}@cluster0-shard-00-00.mp3wx.mongodb.net:27017,cluster0-shard-00-01.mp3wx.mongodb.net:27017,cluster0-shard-00-02.mp3wx.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-im576i-shard-0&authSource=admin&retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        await client.connect();
        const productCollection = client.db('musafir').collection('product');
        console.log(' Musafir Server Traveling');
        //get
        app.get('/product', async (req, res) => {
            const query = {};
            const cursor = productCollection.find(query);
            const products = await cursor.toArray();
            res.send(products)
        });
        //get
        app.get('/inventory/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const product = await productCollection.findOne(query);
            res.send(product);
        });

        //post
        app.post('/product', async (req, res) => {
            const newInventory = req.body;
            const result = await productCollection.insertOne(newInventory);
            res.send(result);
        });


        //Update Quantity
        app.put('/inventory/:id', async (req, res) => {
            const id = req.params.id;
            const updatedQuantity = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    quantity: updatedQuantity.quantity
                }
            };
            const result = await productCollection.updateOne(filter, updatedDoc, options);
            res.send(result);
        })

        // DeliVered
        app.put('/product/:id', async (req, res) => {
            const id = req.params.id;
            const delivered = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
                $set: delivered
            };
            const result = await productCollection.updateOne(filter, updatedDoc, options);
            res.send(result);
        })

        //DELETE
        app.delete('/product/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await productCollection.deleteOne(query);
            res.send(result);
        })

    }
    finally {

    }

}
run().catch(console.dir);

//
app.get('/', (req, res) => {
    res.send("Musafir is Traveling")
});

//test heroku
app.get('/test', (req, res) => {
    res.send("Test successful")
});

app.listen(port, () => {
    console.log("Listening to port", port);
})