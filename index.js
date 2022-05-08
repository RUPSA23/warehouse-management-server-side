const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;

const app = express();

// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uuesw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try{
        await client.connect();
        const dressesCollection = client.db('warehouse').collection('dresses');

        app.get('/dresses', async (req, res) => {
            const query = {};
            const cursor = dressesCollection.find(query).limit(6);
            const dresses = await cursor.toArray();
            res.send(dresses);
        })

        app.get('/alldresses', async (req, res) => {
            const query = {};
            const cursor = dressesCollection.find(query);
            const alldresses = await cursor.toArray();
            res.send(alldresses);
        })

        app.post('/Items', async (req, res) => { 
            const newItem = req.body;
            const result =  await dressesCollection.insertOne(newItem);
            res.send(result);    
        });

        app.get('/dress/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const dress = await dressesCollection.findOne(query);
            res.send(dress);
        })

        app.put('/dress/:id', async(req, res) => {
            const id = req.params.id;
            const data = req.body;
            const query = {_id: ObjectId(id)};
            const options = {upsert: true};
            const updatedDoc = {
                $set: {
                    quantity: data.quantity
                }
            };
            const result = await dressesCollection.updateOne(query, updatedDoc, options);
            const dress = await dressesCollection.findOne(query);
            res.send(dress);
        })

        app.delete('/dress/:id', async (req, res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await dressesCollection.deleteOne(query);
            res.send(result);
        })
    }
    finally {

    }
}

run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Running Warehouse Project');
})

app.listen(port, () => {
    console.log('Listening on port', port);
})