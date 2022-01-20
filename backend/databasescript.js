const dbDriver = require('better-sqlite3');
const { format } = require('path');
const { error, log } = require('console');
const moment = require('moment');
const dbPath = dbDriver('../backend/data/database.db');

let startDate = moment('2022-01-20');
let endDate = moment('2022-07-01');

let DepartureTime = [
  moment('2022-01-20 07:00'),
  moment('2022-01-20 08:00'),
  moment('2022-01-20 11:30'),
  moment('2022-01-20 12:30'),
  moment('2022-01-20 17:00'),
  moment('2022-01-20 21:30'),
  moment('2022-01-20 16:00'),
  moment('2022-01-20 19:00')
];

let TrainId = [1, 2, 1, 2, 1, 1, 3, 3];
let RouteId = [14672, 1467, 27641, 7641, 14672, 27641, 153, 351];
let PriceCoefficient = [1.2, 1.3, 0.9, 0.9, 1.2, 0.9, 1, 1];

while (startDate.isBefore(endDate)) {
  console.log(startDate.format('YYYY-MM-DD HH:mm'));
  for (let i = 0; i < 8; i++) {
    let query = /*SQL*/ `
   INSERT INTO Schedule (
                         TrainId,
                         RouteId,
                         DepartureTime,
                         PriceCoefficient
                     )
                     VALUES (
                         ${TrainId[i]},
                         ${RouteId[i]},
                         \'${DepartureTime[i].format('YYYY-MM-DD HH:mm')}\',
                         ${PriceCoefficient[i]}
                     );
                     `;
    let postToDatabase = dbPath.prepare(query);

    let result = postToDatabase.run();

    console.log(query);
  }

  for (let k = 0; k < 8; k++) {
    DepartureTime[k].add(1, 'days');
  }
  startDate.add(1, 'days');
}
