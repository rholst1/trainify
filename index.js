// require/import express
const express = require('express');

// create a new web server
const webServer = express();

// tell the web server to serve
// all files (static content)
// that are inside the folder "frontend"
webServer.use(express.static('frontend'));

// start the webserver and tell it to listen
// on a specific port (in this case port 3000)
webServer.listen(3000,
  () => console.log('Listening on port 3000'));


// require the sqlite driver better-sqlite3
const driver = require('better-sqlite3');

webbserver.get('/api/greeting', (req, res) => {
  req.setHeader('Content-type'), 'application/json';
  res.send(JSON.stringify({ greeting: 'Hello! The connection works' }));
})

// connect to a database (call the connection db)
//const db = driver('./database/petowners-and-pets.sqlite3');

/* 
  Temporary code starts here
   - we will move it  into a "routes" eventually,
     but this explains prepared statements
*/

// create a prepared statement
/*let preparedStatement = db.prepare(`
  SELECT *
  FROM pets
  WHERE id = :id
`);*/

// run is a method of a prepared statement
// used for all queries except SELECT queries 
// for those we use the method all instead
//let firstPet = preparedStatement.all({ id: 1 });
// we will get an array of objects back
// where each db row corresponds to an object
// and each object property to a column
//console.log(firstPet);

/*
  End of temporary code
*/

// Create a route using the web server method get
//webServer.get('/api/pets', (request, response) => {
  // create a prepared statement with my query
  /*let preparedStatement = db.prepare(`
    SELECT *
    FROM pets
  `);*/
  // run the query
  //let result = preparedStatement.all();
  // send the result as json to the client / browser
  //response.json(result);
//});