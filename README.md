# trainify
Educational project that revolves around creating a Ticket booking app for a passenger-carrier railway company.

# Authors:

* Randa Al Mandawi (randamandawi)
* Sandra Algervik (SaAlgervik)
* Rasmus Holst (rholst1)
* Stefan Holmqvist (sholmqvist)
* Julia Berg (JuliaB-dotcom)
* Svetlana Ernyleva (SvetlanaErn)
* Per Bodå
* Sruthi Krishna Radhakrishnan Rajini
* Awat Farah

# Frameworks:

* React App
* SQLite (better-sql-lite3)
* Node.js
* Express 

# Structure:

.vs folder: 
* Contains the storage of local user settings.

.vscode folder:
* Stores the debugger support.

frontend folder:
* Has a src folder with the subfolder API which contains Axios a HTTP client for node.js and the browser.
* It also has the subfolder Components where all the React Components in this project lays in their own folders.
* You can find the images and the index file in the public folder.

backend folder: 
*	data folder - contains a database file.
*	index.js – the main file in backend - contains endpoints for app requests.
*	nodemailer.js – contains code for sending email confirmation.
*	databasescript.js – contains code for inserting data into the database. Run: node databasescript.js 

 
There is no specific code standard in this project.

#### Database structure

UML: ![DB](https://user-images.githubusercontent.com/70198472/149945752-a8fb1156-d900-4c5a-b171-7f239f4ae317.jpg)

* The script databasescript.js in the backend folder, adds data to the database. 


# Run application:
 
frontend : first run npm install --save @stripe/react-stripe-js @stripe/stripe-js,
create a .env file and put the stripekey from StripePayment.js in it 
then run npm start.

trainify: first run npm install then npm start.


