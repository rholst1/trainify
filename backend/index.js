const express = require('express');
const cors = require('cors');
const stripe = require('stripe')(
  'sk_test_51K6WavLuMgncR3MOQBWdMzbytWTJ7ySxcJel0RjjQyAgLC39rk88VqkphcCrKkEgPKOdxeLjAMARSHZN8WGW1tRP00yoXqSBj0'
);
//const uuid = require("uuid/v4")
const https = require('https');
const app = express();

//middelware
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3001;

// View Engine Setup
app.set('view engine', 'ejs');

//routes
app.get('/', (req, res) => {
  res.send('test Randa');
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

//Shoulde be set from frontend user interaction
let departure = 'G';

const data = `<REQUEST>
      <LOGIN authenticationkey="6b731964d0b14163af4ee6a8110a548b" />
      <QUERY objecttype="TrainAnnouncement" schemaversion="1.3" orderby="AdvertisedTimeAtLocation">
            <FILTER>
                  <AND>
                        <EQ name="ActivityType" value="Avgang" />
                        <EQ name="LocationSignature" value="${departure}" />
                        <OR>
                              <AND>
                                    <GT name="AdvertisedTimeAtLocation" value="$dateadd(-00:15:00)" />
                                    <LT name="AdvertisedTimeAtLocation" value="$dateadd(14:00:00)" />
                              </AND>
                              <AND>
                                    <LT name="AdvertisedTimeAtLocation" value="$dateadd(00:30:00)" />
                                    <GT name="EstimatedTimeAtLocation" value="$dateadd(-00:15:00)" />
                              </AND>
                        </OR>
                  </AND>
            </FILTER>
            <INCLUDE>AdvertisedTrainIdent</INCLUDE>
            <INCLUDE>AdvertisedTimeAtLocation</INCLUDE>
            <INCLUDE>TrackAtLocation</INCLUDE>
            <INCLUDE>ToLocation</INCLUDE>
      </QUERY>
</REQUEST >`;

const options = {
  hostname: 'api.trafikinfo.trafikverket.se',
  port: 443,
  path: '/v2/data.json',
  method: 'POST',
  data: data,
  headers: {
    'Content-Type': 'text/xml',
    'Content-Length': data.length,
  },
};

const req = https.request(options, (res) => {
  console.log(`statusCode: ${res.statusCode}`);

  res.on('data', (d) => {
    process.stdout.write(d);
    console.log(d);
  });
});

req.on('error', (error) => {
  console.log('FEL');
  console.error(error);
});

req.write(data);
req.end();

//listen
app.listen(3002, () => {
  console.log(`Server listening on ${PORT}`);
});
