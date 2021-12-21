

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

// POST FUNCTION 1

  
  // POSTs to DB and fills columns
  // Does not work, because for some reason request.body returns empty(not undefined), unknown why
  // example: use postman to do a POST request towards localhost:3000/api/Ticket
app.post('/api/Ticket', (request, response) => {
    let postToDatabaseQuery = dbPath.prepare(`
      INSERT INTO Ticket
      (seat_number, price, email)
      VALUES(:seat_number, :price, :email)
    `)
    console.log(request.body)
    let result = postToDatabaseQuery.run(request.body)
    response.json(result);
    console.log(result)
    
  });


// POST FUNCTION 2

/* 
  // POSTs to DB and fills column, dynamic setup that maps both table, column names and paramaters dynamically
  // Does not work, because for some reason request.body returns empty(not undefined), unknown why
  // example: use postman to do a POST request towards localhost:3000/api/(insert table name here)
app.post('/api/:table', (request, response) => {
  
  let columnNames = Object.keys(request.body)
  console.log('columnNames', columnNames)
  let columnParameters = Object.keys(request.body).map(columnNames => ':' + columnNames)
  console.log('columnParameters', columnParameters)
  let query = `
  INSERT INTO ${request.params.table}
  (${columnNames})
  VALUES(${columnParameters})
`
  console.log('query',query)
  let postToDatabase = dbPath.prepare(query)
  console.log(request.body)
  let result = postToDatabase.run(request.body)
  response.json(result);
  
});
*/

const nodemailer = require("nodemailer");
const output =
  '<p> You have a new contact request </p>'
'<h3> Contact Details</h3>';

async function main() {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user, // generated ethereal user
      pass: testAccount.pass, // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Fred Foo 👻" <test@example.com>', // sender address
    to: "julia.solbacken@gmail.com", // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html: output, // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

}
main().catch(console.error);