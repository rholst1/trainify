const dbDriver = require('better-sqlite3');
const { format } = require('path');
const { error, log } = require('console');
const moment = require('moment');
const dbPath = dbDriver('./backend/data/database.db');

let startDate = moment('2022-01-01');
let endDate = moment('2022-04-01');

let departureTimes = [
  moment('2022-01-01 10:00'),
  moment('2022-01-01 14:00'),
  moment('2022-01-01 18:00'),
];

let arrivalTimes = [
  moment('2022-01-01 13:00'),
  moment('2022-01-01 17:00'),
  moment('2022-01-01 21:00'),
];

let trainId = [1, 2, 3, 4];
let departureStationId = [1, 2, 3, 5];
let arrivalStationId = [1, 2, 3, 5];

let prices = [295, 295, 795];

while (startDate.isBefore(endDate)) {
  console.log(startDate.format('YYYY-MM-DD HH:mm'));
  for (let i = 0; i < 3; i++) {
    let query = /*SQL*/ `
   INSERT INTO Schedule (
                         TrainId,
                         DepartureStationId,
                         ArrivalStationId,
                         DepartureTime,
                         ArrivalTime,
                         Price
                     )
                     VALUES (
                         ${trainId[i]},
                         ${departureStationId[1]},
                         ${arrivalStationId[0]},
                         \'${departureTimes[i].format('YYYY-MM-DD HH:mm')}\',
                         \'${arrivalTimes[i].format('YYYY-MM-DD HH:mm')}\',
                         ${prices[i]}
                     );
                     `;
    let postToDatabase = dbPath.prepare(query);

    let result = postToDatabase.run();

    console.log(query);
  }

  for (let k = 0; k < 3; k++) {
    arrivalTimes[k].add(1, 'days');
    departureTimes[k].add(1, 'days');
  }
  startDate.add(1, 'days');
}
