const nodemailer = require("nodemailer");

const output = ` 
<p> Hej!</p>
<p> Din resa är nu bokad, se din biljett nedan. </p>
<footer>
Tack för att för att du väljer att resa med oss!
<h2> Train Team </h2>
</footer > 
`
  
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'trainteam14@gmail.com',
    pass: '@Trainteam1'
  }
});

// send mail with defined transport object
let mailOptions = {
  from: '"Trainify Team" <trainteam14@gmail.com>', // sender address
  to: "julia.solbacken@gmail.com", // list of receivers
  subject: "Bokningsbekräftelse", // Subject line
  text: "none graphical text", // plain text body
  html: output, // html body
};

transporter.sendMail(mailOptions, (err, info) => {
  if (err) {
    console.log("Error!" + err.message)

  }

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

});

