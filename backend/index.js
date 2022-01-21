const nodemail = require('./nodemailer');
console.log(nodemail);
let bookingInformation = require('./nodemailer');

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

const app = express();
app.use(express.static(path.join(__dirname, '../frontend', 'build')));


//middelware
app.use(express.json());
app.use(cors());

// View Engine Setup
app.set('view engine', 'ejs');

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

// Driver for better-sqlite3
const dbDriver = require('better-sqlite3');
const { format } = require('path');
const { error } = require('console');
const { query } = require('express');

// Database connector with DB path
const dbPath = dbDriver('./backend/data/database.db');


app.post('/api/db/post/:table', (request, response) => {
  try {
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
    let result = postToDatabase.run(request.body);
    response.sendStatus(200);
   
  } catch (error) {
    console.log('caught error');
    console.log(error);
    response.sendStatus(500);
  }
});

// GET function that takes as input parameters DepartureStation, ArrivalStation and day,
// rerturns a list of seats available for booking.
// example: http://localhost:3001/api/db/getunoccupiedseats?from='Göteborg C'&to='Stockholm Central'&day=2022-02-01
app.get('/api/db/getunoccupiedseats', (request, response) => {
  let day = new Date(request.query.day);
  let nextDay = new Date(day);
  nextDay.setDate(day.getDate() + 1);
  let dayStr = request.query.day;
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
  Join Seat On Train.Id = Seat.TrainId
  Join Station As DepSt On Schedule.DepartureStationId = DepSt.Id
  Join Station As ArrSt On Schedule.ArrivalStationId = ArrSt.Id
  Where DepSt.Name=${request.query.from} AND ArrSt.Name=${request.query.to} AND Schedule.DepartureTime BETWEEN  '${dayStr}' AND '${nextDayStr}'
  Order by Schedule.DepartureTime ASC, Train.Name ASC, Seat.WagonNr ASC, Seat.SeatNr ASC
    `;
  let requestDB = dbPath.prepare(query);
  let result = requestDB.all();
  response.json(result);
  console.log(query);
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

// Returns tickets from a specific order
// example: http://localhost:3001/api/db/gettickets?order=test@test.com_2022-01-20_10:39`
app.get('/api/db/gettickets', (request, response) => {

  var query = `
    Select Ticket.email, Ticket.Id AS TicketNumber, Ticket.Price, Schedule.Id, Schedule.TrainId, Train.Name, DepSt.Name AS Departure, ArrSt.Name AS Arrival, Schedule.DepartureTime, Schedule.ArrivalTime, Ticket.SeatGuid, Seat.WagonNr, Seat.SeatNr
    From Ticket
    Join Schedule On Schedule.Id=Ticket.ScheduleId
    Join Train On Schedule.TrainId = Train.Id
    Join Seat On Ticket.SeatGuid = Seat.Id
    Join Station As DepSt On Schedule.DepartureStationId = DepSt.Id
    Join Station As ArrSt On Schedule.ArrivalStationId = ArrSt.Id
    Where Ticket.OrderId = '${request.query.order}'
  `;
  
  console.log(query);
  let requestDB = dbPath.prepare(query);
  let result = requestDB.all();
  resultArr = Object.values(result);
  bookingInformation(Object.values(resultArr));
});