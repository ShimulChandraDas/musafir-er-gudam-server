const express = require('express');
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express()


//musafirdb
//bILdnIM9YRI1v4lU

//middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.S3_BUCKET}:${process.env.SECRET_KEY}@cluster0.mp3wx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
    const collection = client.db("test").collection("devices");

    console.log("Musafr Db Connected");
    // perform actions on the collection object
    client.close();
});


//
app.get('/', (req, res) => {
    res.send("Musafir is Traveling")
});

app.listen(port, () => {
    console.log("Listening to port", port);
})