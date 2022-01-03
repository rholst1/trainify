const nodemail = require('./nodemailer');
console.log(nodemail);

const path = require('path');
const express = require('express');
const cors = require('cors');
const stripe = require('stripe')(
  'sk_test_51K6WavLuMgncR3MOQBWdMzbytWTJ7ySxcJel0RjjQyAgLC39rk88VqkphcCrKkEgPKOdxeLjAMARSHZN8WGW1tRP00yoXqSBj0'
);

let PORT = process.env.PORT;
if (PORT == null || PORT == '') {
  PORT = 3001;
}
//const uuid = require("uuid/v4")

// const sqlite3 = require("sqlite3").verbose();

const app = express();
app.use(express.static(path.join(__dirname, '../frontend', 'build')));
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
app.use(express.json());
app.use(cors());

// View Engine Setup
app.set('view engine', 'ejs');

//routes
app.get('/', (req, res) => {
  res.send('test Randa');
});

app.post('/paymentTwo', cors(), async (req, res) => {
  let { amount, id } = req.body;

  try {
    const payment = await stripe.paymentIntents.create({
      amount,
      currency: 'USD',
      description: 'Test Of card',
      payment_method: id,
      confirm: true,
    });
    console.log('Payment', payment);
    res.json({
      message: 'succes',
      success: true,
    });
  } catch (error) {
    console.log('Error', error);
    res.json({
      message: 'Error',
      success: false,
    });
  }
});

app.post('/payment', (req, res) => {
  const { product, token } = req.body;
  console.log('Product', product);
  console.log('Price', product.price);
  //const idempontencyKey = uuid()

  return stripe.customers
    .create({
      email: token.email,
      source: token.id,
    })
    .then((customer) => {
      stripe.charges.create({
        amount: product.price * 100,
      });
    })
    .then((result) => res.status(200).json(result))
    .catch((err) => console.log(err));
});

// Driver for better-sqlite3
const dbDriver = require('better-sqlite3');
const { format } = require('path');

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

  let fetchIdFromDatabase = dbPath.prepare(query);
  console.log('GET request input: ', request.params);
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

  let fetchEmailFromDatabase = dbPath.prepare(query);
  console.log('GET request input: ', request.params);
  let result = fetchEmailFromDatabase.all({ email: request.params.email });

  response.json(result);
  console.log('GET request returned data (from DB): ', result);
});

// POST Function that posts to DB and fills column, dynamic setup that maps both table, column names and paramaters dynamically
// example: use postman to do a POST (with json matching that table setup) request towards
// localhost:3001/api/db/post/(insert table name here)
//  Example json in POST body
//  URL: /api/db/post/Ticket
//  Body
//  {
//     "email":  "test@test.com",
//     "ScheduleId": "1",
//     "Price": "400",
//     "SeatGuid": "103"
// }

app.post('/api/db/post/:table', (request, response) => {
  let columnNames = Object.keys(request.body);
  let columnParameters = Object.keys(request.body).map(
    (columnNames) => ':' + columnNames
  );

  let query = `
    INSERT INTO ${request.params.table}
    (${columnNames})
    VALUES(${columnParameters})
    `;

  let postToDatabase = dbPath.prepare(query);
  console.log(request.params);
  console.log(
    'Data Posted to DB: ',
    request.body,
    'Into Table:',
    request.params
  );
  try
  {
    let result = postToDatabase.run(request.body);
    console.log('Changes to DB: ', result);
    response.sendStatus(200);
  }
  catch
  {
    response.sendStatus(500);
    console.log('error');
  }
});

// Get function that returns a list of stations
// example: localhost:3001/api/db/getstations
app.get('/api/db/getstations', (request, response) => {
  let query = `
        SELECT *
        FROM Station
        `;

  let requestDB = dbPath.prepare(query);
  console.log('GET request - get all stations');
  let result = requestDB.all();
  response.json(result);
  console.log('GET request returned data (from DB): ', result);
});

// GET function that takes as input parameters DepartureStationId, ArrivalStationId and day,
// rerturns a list of seats available for booking.
// example: http://localhost:3001/api/db/getunoccupiedseats?from=1&to=2&day=2022-02-01
app.get('/api/db/getunoccupiedseats', (request, response) => {
  let day = new Date(request.query.day);
  let nextDay = new Date(day);
  nextDay.setDate(day.getDate() + 1);
  let dayStr = formatDate(day);
  let nextDayStr = formatDate(nextDay);

  let query = `
  Select Schedule.Id AS ScheduleId, Schedule.TrainId, Train.Name, DepSt.Name AS Departure, ArrSt.Name AS Arrival, Schedule.DepartureTime, Schedule.ArrivalTime, Schedule.Price, Seat.Id AS SeatGuid, Seat.WagonNr, Seat.SeatNr 
  From Schedule
  Join Train On Schedule.TrainId = Train.Id
  Join Seat On Train.Id = Seat.TrainId
  Join Station As DepSt On Schedule.DepartureStationId = DepSt.Id
  Join Station As ArrSt On Schedule.ArrivalStationId = ArrSt.Id
  Where DepSt.Name=${request.query.from} AND ArrSt.Name=${request.query.to} AND Schedule.DepartureTime BETWEEN '${dayStr}' AND '${nextDayStr}'
  Except
  Select Schedule.Id AS ScheduleId, Schedule.TrainId , Train.Name, DepSt.Name AS Departure, ArrSt.Name AS Arrival, Schedule.DepartureTime, Schedule.ArrivalTime, Schedule.Price, Ticket.SeatGuid  AS SeatGuid, Seat.WagonNr, Seat.SeatNr
  From Ticket
  Join Schedule On Schedule.Id=Ticket.ScheduleId
  Join Train On Schedule.TrainId = Train.Id
  Join Seat On Ticket.SeatGuid=Seat.Id
  Join Station As DepSt On Schedule.DepartureStationId = DepSt.Id
  Join Station As ArrSt On Schedule.ArrivalStationId = ArrSt.Id
  Where DepSt.Name=${request.query.from} AND ArrSt.Name=${request.query.to} AND Schedule.DepartureTime BETWEEN  '${dayStr}' AND '${nextDayStr}'
  Order by Schedule.DepartureTime ASC, Train.Name ASC, Seat.WagonNr ASC, Seat.SeatNr ASC
    `;
  console.log(query);
  let requestDB = dbPath.prepare(query);
  let result = requestDB.all();
  response.json(result);
  console.log('GET request returned data (from DB): ', result);
});

function formatDate(date) {
  var d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [year, month, day].join('-');
}



//listen
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
