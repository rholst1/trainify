const nodemail = require('./nodemailer');
console.log(nodemail);

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


const PORT = 3001

// View Engine Setup 
app.set("view engine", "ejs");

//routes
app.get("/", (req, res) => {
  res.send("test Randa")
});

app.post('/paymentTwo', cors(), async (req, res) => {
  let { amount, id } = req.body

  try {
    const payment = await stripe.paymentIntents.create({
      amount,
      currency: 'USD',
      description: 'Test Of card',
      payment_method: id,
      confirm: true
    })
    console.log('Payment', payment)
    res.json({
      message: 'succes',
      success: true
    })
  } catch (error) {
    console.log('Error', error)
    res.json({
      message: 'Error',
      success: false
    })

  }
})

app.post("/payment", (req, res) => {

  const { product, token } = req.body;
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
// example: localhost:3001/api/db/getid/Ticket/1 <--- Get you all the data from Ticket table with ID 1
app.get('/api/db/getid/:table/:id', (request, response) => {

  let query = `
      SELECT * 
      FROM ${request.params.table}
      WHERE id = :id
      `;

  let fetchIdFromDatabase = dbPath.prepare(query)
  console.log('GET request input: ', request.params)
  let result = fetchIdFromDatabase.all({ id: request.params.id });

  response.json(result);
  console.log('GET request returned data (from DB): ', result);

});

// GET Function that grabs table name and email dynamically
// example localhost:3001/api/db/getemail/(db table)/(email in db) <--- Gets you all db info connected to the email in that row
app.get('/api/db/getemail/:table/:email', (request, response) => {

  let query = `
      SELECT * 
      FROM ${request.params.table}
      WHERE email = :email
      `;

  let fetchEmailFromDatabase = dbPath.prepare(query)
  console.log('GET request input: ', request.params)
  let result = fetchEmailFromDatabase.all({ email: request.params.email });

  response.json(result);
  console.log('GET request returned data (from DB): ', result);

});


// POST Function that posts to DB and fills column, dynamic setup that maps both table, column names and paramaters dynamically
// example: use postman to do a POST (with json matching that table setup) request towards
// localhost:3000/api/db/post/(insert table name here)
app.post('/api/db/post/:table', (request, response) => {

  let columnNames = Object.keys(request.body)
  let columnParameters = Object.keys(request.body).map(columnNames => ':' + columnNames)

  let query = `
    INSERT INTO ${request.params.table}
    (${columnNames})
    VALUES(${columnParameters})
    `;

  let postToDatabase = dbPath.prepare(query)
  console.log(request.params)
  console.log('Data Posted to DB: ', request.body, 'Into Table:', request.params)
  let result = postToDatabase.run(request.body)
  response.json(result);
  console.log('Changes to DB: ', result)
});

  app.get('/api/db/getstations', (request, response) => {

    let query = `
        SELECT *
        FROM Station
        `;
  
    let requestDB = dbPath.prepare(query)
    console.log('GET request - get all stations')
    let result = requestDB.all();
    response.json(result);
    console.log('GET request returned data (from DB): ' , result);
  });
