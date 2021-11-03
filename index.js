const express = require('express')
const cors = require("cors");
require("dotenv").config();
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;
const port = process.env.PORT || 5000;
const app = express()

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.r9lid.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try{
        await client.connect()
        const tourdb = client.db("tourdb");
        const packages = tourdb.collection("pakages");
        const Orders = tourdb.collection("orders");

        // Add Order
        app.post('/addorder',async(req,res)=>{
          const result = await Orders.insertOne(req.body);
            res.send(result);
        }) 
        
        // Insert a myBookings
        app.post('/myBooking',async(req,res)=>{
          const result = await Orders.insertOne(req.body);
            res.send(result);
        }) 

        

        // Get My myBookings
        app.get("/myBooking/:email", async (req, res) => {
          const result = await Orders.find({
            email: req.params.email,
          }).toArray();
          res.send(result);
        });

        // Delete myBookings
        app.delete("/myBooking/:id", async (req, res) => {
          const result = await Orders.deleteOne({_id:ObjectId(req.params.id)})
          res.send(result);
        });

        // Update Order Status
        app.put("/bookingUpdate/:id",async(req,res)=>{
          const query = {_id:ObjectId(req.params.id)}
          const options = { upsert: true };
          const updateStatus = {
            $set: {
              status: "Approved"
            },
          };
          const result = await Orders.updateOne(query, updateStatus, options);
          res.send(result);
          
        })

        // Get All Bookings
        app.get("/allBookings",async(req,res)=>{
          const result = await Orders.find({}).toArray();
          res.send(result)
        })
        
        // Add Packeges
        app.post('/pakages',async(req,res)=>{
            const result = await packages.insertOne(req.body);
            res.send(result);
        })

        // Get All Packeges
        app.get('/allpakages',async(req,res)=>{
          const result = await packages.find({}).toArray();
          res.send(result)
        })

        // Get One Package
        app.get('/package/:id',async(req,res)=>{
          const query = {_id:ObjectId(req.params.id)}
          console.log(query);
          const result = await packages.findOne(query);
            res.send(result);
        }) 

        


        
    }finally{
        // await client.close()
    }
}
run().catch(console.dir)

app.get('/', (req, res) => {
  res.send(' Sarver Site Working Proparly')
})

app.listen(port, () => {
  console.log(`App Listen at http://localhost:${port}`)
})