const nodemail = require('./nodemailer');
console.log(nodemail);
let bookingInformation = require('./nodemailer');
var moment = require('moment');
moment().format();

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
const { error } = require('console');
const { query } = require('express');
const { stringify } = require('querystring');

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

// example: http://localhost:3001/api/db/schedule?from=Skövde C&to=Katrineholm C&day=2022-02-01
app.get('/api/db/schedule', (request, response) => {
  let result = [];
  try {
    // all routes between station 'from' and station 'to' (includes opposite direction)
    let allRoutes = getRoutes(request.query.from, request.query.to);
    // routes from station 'from' to station 'to' (not include opposite direction)
    let rightDirectionRoutes = getRoutesRightDirection(allRoutes, request.query.from, request.query.to)
    // scheduleIds from station 'from' to station 'to' and selected day
    let scheduleIds = getScheduleIds(rightDirectionRoutes, request.query.day);
    // an array with ScheduleId, DepartureTime (from the first station of the whole route, not from StationFromName), StationFromName, StationToName, TransilteTime, StopTime, Price, PriceCoefficient 
    let schedules = getSchedules(scheduleIds);
    // an array with ScheduleId, DepartureStation('from'), DepartureTime('from'), ArrivalStation('to'), ArrivalTime('to'), Price 
    let scheduleFromToStationDay = getDepartureAndArrivalTimeForSelectedStations(JSON.stringify(schedules), request.query.from, request.query.to);

    let allSeats = getAllSeats(scheduleIds);
    let occupiedSeats = getOccupaidSeats(scheduleIds);
    let unoccupiedSeats = getUnoccupiedSeat(allSeats, occupiedSeats);
    let seatIdsFromTo = getSeatIdsFromTo(unoccupiedSeats, request.query.from, request.query.to);
    result = joinScheduleTickets(scheduleFromToStationDay, seatIdsFromTo);
  }
  catch { }
  response.json(result);
});

function getRoutes(Station1, Station2) {
  let queryRoutes = `
  Select Route.Id
  From Route
  Join Join_Route_Parts On Route.Id = Join_Route_Parts.RouteId
  Join Parts On Join_Route_Parts.PartOfRouteId = Parts.Id
  Join Station As Station1 On Parts.Station1Id = Station1.Id
  Join Station As Station2 On Parts.Station2Id = Station2.Id
  Where Station1.Name = '${Station1}'
  INTERSECT
  Select Route.Id
  From Route
  Join Join_Route_Parts On Route.Id = Join_Route_Parts.RouteId
  Join Parts On Join_Route_Parts.PartOfRouteId = Parts.Id
  Join Station As Station1 On Parts.Station1Id = Station1.Id
  Join Station As Station2 On Parts.Station2Id = Station2.Id
  Where Station2.Name = '${Station2}'
  `;
  let requestDBRoutes = dbPath.prepare(queryRoutes);
  let routes = requestDBRoutes.all();
  return routes;
}
function getRouteParts(RouteId) {
  let query = `
  Select Route.Id, DepartureStation.Name AS DepartureStation, Station1.Name AS DepSt_Part,  Station2.Name AS ArrSt_Part
  From Route
  Join Station As DepartureStation On Route.DepartureStationId=  DepartureStation.Id
  Join Join_Route_Parts On Route.Id = Join_Route_Parts.RouteId
  Join Parts On Join_Route_Parts.PartOfRouteId = Parts.Id
  Join Station As Station1 On Parts.Station1Id = Station1.Id
  Join Station As Station2 On Parts.Station2Id = Station2.Id
  Where Route.Id = ${RouteId}
  `;
  let requestDB = dbPath.prepare(query);
  let parts = requestDB.all();
  return parts
}
function getRoutesRightDirection(allRoutes, fromStation, toStation) {
  let routesRightDirection = [];
  allRoutes.forEach(route => {

    let parts = getRouteParts(route.Id);
    let dep = fromStation;
    while (true) {
      let part = parts.find(p => p.DepSt_Part == dep);
      if (part === undefined) break;
      dep = part.ArrSt_Part;
      if (dep === toStation) {
        routesRightDirection.push(route.Id);
        break;
      }
    }
  });
  return routesRightDirection;
}
function getScheduleIds(routes, queryday) {
  let day = new Date(queryday);
  let nextDay = new Date(day);
  nextDay.setDate(day.getDate() + 1);
  let dayStr = queryday;
  let nextDayStr = formatDate(nextDay);
  let scheduleId = [];
  routes.forEach(route => {
    let query = `
    Select Schedule.Id
    From Schedule
    Where RouteId=${route} AND DepartureTime Between '${dayStr}' AND '${nextDayStr}'
    `;
    let requestDB = dbPath.prepare(query);
    let result = requestDB.all();
    result.forEach(res => {
      scheduleId.push(res);
    });
  });
  return scheduleId;
}
function getSchedules(scheduleIds) {
  let schedules = [];
  scheduleIds.forEach(scheduleId => {
    let result = getSchedule(scheduleId.Id);
    schedules.push(result);
  });
  return schedules;
}
function getSchedule(Id) {
  let query = `
    Select Schedule.Id, DepStation.Name As DepartureRoute, Schedule.DepartureTime, Station1.Name AS DeparturePart,
    Station2.Name AS ArrivalPart, Parts.TransiteTime, Join_Route_Parts.StopTime, Parts.Price, Schedule.PriceCoefficient
    From Schedule
    Join Route On Schedule.RouteId = Route.Id
    Join Join_Route_Parts On Route.Id = Join_Route_Parts.RouteId
    Join Parts On Join_Route_Parts.PartOfRouteId = Parts.Id
    Join Station As Station1 On Parts.Station1Id = Station1.Id
    Join Station As Station2 On Parts.Station2Id = Station2.Id
    Join Station As DepStation On Route.DepartureStationId=DepStation.Id
    Where Schedule.Id=${Id}
    `;
  let requestDB = dbPath.prepare(query);
  let result = requestDB.all();
  return result;
}
function getDepartureAndArrivalTimeForSelectedStations(schedulesString, departureStationSearch, arrivalStationSearch) {

  let schedules = JSON.parse(schedulesString);
  let newSchedule = [];

  schedules.forEach(scheduleId => {
    let newScheduleRow = {};
    newScheduleRow.ScheduleId = scheduleId[0].Id;
    newScheduleRow.DepartureStation = departureStationSearch;
    newScheduleRow.ArrivalStation = arrivalStationSearch;

    newScheduleRow.DepartureTime = null;
    let time = moment(scheduleId[0].DepartureTime, "YYYY-MM-DD HH:mm");
    let station = scheduleId[0].DepartureRoute;
    let price = 0;
    while (true) {
      let part = scheduleId.find(p => p.DeparturePart === station);
      if (station === departureStationSearch) {
        newScheduleRow.DepartureTime = time.format("YYYY-MM-DD HH:mm");
      }
      station = part.ArrivalPart;
      time = addTime(time, moment(part.TransiteTime, "HH:mm"));
      if (newScheduleRow.DepartureTime !== null) price = price + part.Price;
      if (station === arrivalStationSearch) {
        newScheduleRow.ArrivalTime = time.format("YYYY-MM-DD HH:mm");
        newScheduleRow.Price = parseFloat(scheduleId[0].PriceCoefficient) * price;
        break;
      }
      time = addTime(time, moment(part.StopTime, "HH:mm"));
    };
    newSchedule.push(newScheduleRow);
  });
  return newSchedule;
}
// return moment1(type of 'moment' in format "YYYY-MM-DD HH:mm") + moment2(type of 'moment' in format "HH:mm")
function addTime(moment1, moment2) {
  let hours = moment(moment2, "HH:mm").hours();
  let minutes = moment(moment2, "HH:mm").minutes();
  moment1.add(hours, 'hours').add(minutes, 'minutes');
  return moment1;
}
function getAllSeats(scheduleIds) {
  let allTickets = [];
  scheduleIds.forEach(scheduleId => {
    let query = `
    Select Schedule.Id AS ScheduleId, Seat.Id AS SeatId, Seat.TrainId, Train.Name,Seat.WagonNr, Seat.SeatId AS Seat,  DepartureRoute.Name As DepartureRoute,
   Parts.Id  AS PartId, DeparturePart.Name AS DeparturePart, ArrivalPart.Name AS ArrivalPart
  From Schedule
  Join Train On Schedule.TrainId = Train.Id
  Join Seat On Train.Id=Seat.TrainId
  Join Route On Schedule.RouteId = Route.Id
  Join Join_Route_Parts On Route.Id = Join_Route_Parts.RouteId
  Join Parts On Join_Route_Parts.PartOfRouteId = Parts.Id
  Join Station As DeparturePart On Parts.Station1Id = DeparturePart.Id
  Join Station As ArrivalPart On Parts.Station2Id = ArrivalPart.Id
  Join Station As DepartureRoute On Route.DepartureStationId=DepartureRoute.Id
  Where Schedule.Id = ${scheduleId.Id} 
    `;
    let requestDB = dbPath.prepare(query);
    let tickets = requestDB.all();
    allTickets.push(tickets);
  });
  return simplifyArray(allTickets);
}
function getOccupaidSeats(scheduleIds) {
  let occupiedSeats = [];
  scheduleIds.forEach(scheduleId => {
    let query = `
    Select Schedule.Id AS ScheduleId, Ticket.SeatGuid AS SeatId, Seat.TrainId, Train.Name, Seat.WagonNr, Seat.SeatId AS Seat, DepartureRoute.Name As DepartureRoute,
    Parts.Id AS PartId, DeparturePart.Name AS DeparturePart, ArrivalPart.Name AS ArrivalPart,
   DepartureTicket.Name AS DepartureTicket, ArrivalTicket.Name AS ArrivalTicket
   From Ticket
   Join Seat On Ticket.SeatGuid=Seat.Id
   Join Schedule On Ticket.ScheduleId = Schedule.Id
   Join Route On Schedule.RouteId = Route.Id
   Join Join_Route_Parts On Route.Id = Join_Route_Parts.RouteId
   Join Parts On Join_Route_Parts.PartOfRouteId = Parts.Id
   Join Station As DeparturePart On Parts.Station1Id = DeparturePart.Id
   Join Station As ArrivalPart On Parts.Station2Id = ArrivalPart.Id
   Join Station As DepartureRoute On Route.DepartureStationId=DepartureRoute.Id
   Join Station As DepartureTicket On Ticket.FromStationId = DepartureTicket.Id
   Join Station As ArrivalTicket On Ticket.ToStationId = ArrivalTicket.Id
   Join Train On Schedule.TrainId=Train.Id
  Where Schedule.Id = ${scheduleId.Id} 
    `;
    let requestDB = dbPath.prepare(query);
    let occupied = requestDB.all();
    occupiedSeats.push(occupied);
  });

  occupiedSeats = removeUnocciedParts(occupiedSeats);

  return simplifyArray(occupiedSeats);
}
function removeUnocciedParts(seats) {
  occupiedSeats = [];
  seats.forEach(scheduleId => {
    seatIds = getUniqueSeatIds(scheduleId);

    seatIds.forEach(seatId => {
      let parts = scheduleId.filter(s => s.SeatId == seatId);
      let depTicket = parts[0].DepartureTicket;
      let arrTicket = parts[0].ArrivalTicket;
      let dep = parts[0].DepartureRoute;
      let occupied = [];
      while (true) {
        let part = parts.find(p => p.DeparturePart === dep);
        if (dep == depTicket) {
          while (dep !== arrTicket) {
            occupied.push(part);
            dep = part.ArrivalPart;
            part = parts.find(p => p.DeparturePart === dep);
          }
          break;
        }
        dep = part.ArrivalPart;
      };
      occupiedSeats.push(occupied);
    });
  });
  return occupiedSeats;
}

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

function getUniqueSeatIds(seats) {
  let seatIds = [];
  seats.forEach(row => {
    seatIds.push(row.SeatId);
  });
  let uniqueSeatIds = seatIds.filter(onlyUnique);
  return uniqueSeatIds;
}
function getUnoccupiedSeat(allSeats, occupiedSeats) {
  let unoccupiedSeat = allSeats;

  occupiedSeats.forEach(row => {
    unoccupiedSeat = unoccupiedSeat.filter(
      s => s.ScheduleId != row.ScheduleId || s.SeatId != row.SeatId || s.PartId != row.PartId);
  });
  return unoccupiedSeat;
}
function simplifyArray(array) {
  let simpleArray = [];
  array.forEach(external => {
    external.forEach(internal => {
      simpleArray.push(internal);
    });
  });
  return simpleArray;
}

function getSeatIdsFromTo(seats, from, to) {
  let newArray = [];
  let checked = [];

  seats.forEach(seat => {
    let scheduleId = seat.ScheduleId;
    let seatGuid = seat.SeatId;
    let isChecked = checked.find(s => s.scheduleId == scheduleId && s.seatGuid == seatGuid);

    if (isChecked === undefined) {
      let parts = seats.filter(s => s.ScheduleId == scheduleId && s.SeatId == seatGuid);
      let dep = from;

      while (true) {
        let part = parts.find(p => p.DeparturePart === dep);
        if (part === undefined) break;
        dep = part.ArrivalPart;
        if (dep === to) {
          let row = {};
          row.ScheduleId = scheduleId;
          row.SeatId = seatGuid;
          row.TrainId = seat.TrainId;
          row.Name = seat.Name;
          row.WagonNr = seat.WagonNr;
          row.Seat = seat.Seat;
          newArray.push(row);
          break;
        }
      }
      let checkedSeat = {};
      checkedSeat.scheduleId = scheduleId;
      checkedSeat.seatGuid = seatGuid;
      checked.push(checkedSeat);
    }
  });
  return newArray;
}

function joinScheduleTickets(schedules, tickets) {
  let result = [];
  let fromStationId = getStationId(schedules[0].DepartureStation);
  let toStationId = getStationId(schedules[0].ArrivalStation);
  tickets.forEach(ticket => {
    let row = {};
    row.ScheduleId = ticket.ScheduleId;
    row.SeatGuid = ticket.SeatId;
    row.TrainId = ticket.TrainId;
    row.Name = ticket.Name;
    row.WagonNr = ticket.WagonNr;
    row.SeatNr = ticket.Seat;
    let schedule = schedules.find(s => s.ScheduleId == ticket.ScheduleId);
    row.Departure = schedule.DepartureStation;
    row.Arrival = schedule.ArrivalStation;
    row.DepartureTime = schedule.DepartureTime;
    row.ArrivalTime = schedule.ArrivalTime;
    row.Price = schedule.Price;
    row.FromStationId = fromStationId;
    row.ToStationId = toStationId;
    result.push(row);
  });

  // TODO: sort result
  return result;
}
function getStationId(name) {
  let query = `
    Select Id
    From Station
    Where Station.Name = '${name}' 
    `;
  let requestDB = dbPath.prepare(query);
  let res = requestDB.all();
  return res[0].Id;
}

app.get('/api/db/gettickets', (request, response) => {

  var query = `
    Select Ticket.email, Ticket.Id AS TicketNumber, Ticket.Price, Schedule.Id, Schedule.TrainId, Train.Name, Departure.Name AS Departure,
    Arrival.Name AS Arrival, Ticket.SeatGuid, Seat.WagonNr, Seat.SeatId
    From Ticket
    Join Schedule On Schedule.Id=Ticket.ScheduleId
    Join Train On Schedule.TrainId = Train.Id
    Join Seat On Ticket.SeatGuid = Seat.Id
    Join Station As Departure On Ticket.FromStationId = Departure.Id
    Join Station As Arrival On Ticket.ToStationId = Arrival.Id
    Where Ticket.OrderId = '${request.query.order}'
  `;

  let requestDB = dbPath.prepare(query);
  let result = requestDB.all();
  let scheduleIds = [];
  result.forEach(res => {
    let IdRow = {};
    IdRow.Id = res.Id;
    scheduleIds.push(IdRow);
  });
  let schedules = getSchedules(scheduleIds);
  let DepArrTime = getDepartureAndArrivalTimeForSelectedStations(JSON.stringify(schedules), result[0].Departure, result[0].Arrival);
  let allInfo = [];

  for (let i = 0; i < result.length; i++) {
    let newTicket = {};
    newTicket.email = result[i].email;
    newTicket.TicketNumber = result[i].TicketNumber;
    newTicket.Price = result[i].Price;
    newTicket.Departure = result[i].Departure;
    newTicket.Arrival = result[i].Arrival;
    newTicket.WagonNr = result[i].WagonNr;
    newTicket.SeatId = result[i].SeatId;
    newTicket.TrainId = result[i].TrainId;
    newTicket.Name = result[i].Name;
    newTicket.DepartureTime = DepArrTime[i].DepartureTime;
    newTicket.ArrivalTime = DepArrTime[i].ArrivalTime;
    allInfo.push(newTicket);
  };
  resultArr = Object.values(allInfo);
  bookingInformation(Object.values(resultArr));
});

