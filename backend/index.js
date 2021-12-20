const path = require('path');
const express = require("express")
const cors = require("cors")
const stripe = require("stripe")("sk_test_51K6WavLuMgncR3MOQBWdMzbytWTJ7ySxcJel0RjjQyAgLC39rk88VqkphcCrKkEgPKOdxeLjAMARSHZN8WGW1tRP00yoXqSBj0")
//const uuid = require("uuid/v4")

// const sqlite3 = require("sqlite3").verbose();

const app = express();

// const db_name = path.join(__dirname, "data", "database.db");
// connect to the database
/* const db = new sqlite3.Database(db_name, err => {
  if (err) {
    return console.error(err.message);
  }
  console.log("Successful connection to the database 'apptest.db'");
});

*/

//middelware
app.use(express.json())
app.use(cors())


const PORT = process.env.PORT || 3001

// View Engine Setup 
app.set("view engine", "ejs");

//routes
app.get("/",(req, res) =>{ 
  res.send("test Randa")
});

app.post("/payment", (req,res) => {

  const {product, token} = req.body;
  console.log("Product", product);
  console.log("Price", product.price);
  //const idempontencyKey = uuid()

  return stripe.customers.create({
    email: token.email,
    source: token.id
  }).then(customer => {
    stripe.charges.create({
      amount: product.price * 100
    })
  }).then(result => res.status(200).json(result))
  .catch(err => console.log(err))

})


//listen
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

  // Driver for better-sqlite3
const dbDriver = require('better-sqlite3');

  // Database connector with DB path
const dbPath = dbDriver('./backend/data/database.db');


  // GET Function that grabs tablename and ID dynamically
  // example: localhost:3001/api/Ticket/1 <--- Get you all the data from Ticket table with ID 1
app.get('/api/:table/:id', (request, response) => {

  let fetchIdFromDatabase = dbPath.prepare(`
      SELECT * 
      FROM ${request.params.table}
      WHERE id = :id
      `);

  let result = fetchIdFromDatabase.all({id: request.params.id});

  response.json(result);
  console.log(result);

  });
