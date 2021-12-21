const nodemailer = require("nodemailer");

const output =
  '<p> This is your tickets! </p>';

// create reusable transporter object using the default SMTP transport
 //Using Etherials test account.
const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
    user: 'devante.lindgren43@ethereal.email',
    pass: 'vdxpnq1gzhN2T7xTK9'
  }
});

// send mail with defined transport object
let message = {
  from: '"Trainify Team" <trainteam@example.com>', // sender address
  to: "vargen@gmail.com.testing@live.se,loket@gmail.com", // list of receivers
  subject: "Booking confirmation", // Subject line
  text: "none graphical text", // plain text body
  html: output, // html body
};

transporter.sendMail(message, (err, info) => {
  if (err) {
    console.log("Error!" + err.message)

  }

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account.
  // Click on the prewiev link in terminal to view the message.
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
});

