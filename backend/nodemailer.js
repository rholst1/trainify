const nodemailer = require('nodemailer');

module.exports = function (bookingInformation) {
  const output = `
  <!DOCTYPE html>
<html lang="en">
  <div name="main" style="background-color: #e0d6c4; padding-right: 30vh ">
 
 <div name=innerContainer style="padding: 1vh">
 <div name=mainContainer style="padding-left: 10vh; background-color: whitesmoke; padding: 1vh">
<div name="header" style="padding: 0"><h2><p>Bokningsbekräftelse</p></h2></div>
<div name="subject"><h3>Tack för din bokning, se din biljett nedan.</p></h3><br></div>

<div name="ticket" display=flex style="color:Black;"><p name="ticketText">
Biljettnummer: ${bookingInformation[1]}<br>
Pris: ${bookingInformation[2]}<br>
Avresa:      ${bookingInformation[6]} - Tid för avgång:  ${getWeekday(bookingInformation[8])} ${bookingInformation[8]}<br>
Destination: ${bookingInformation[7]} - Tid för ankomst: ${getWeekday(bookingInformation[9])} ${bookingInformation[9]}<br>
Vagn: ${bookingInformation[11]}<br>
Sittplats: ${bookingInformation[12]}<br>
Tågnummer: ${bookingInformation[4]}<br>
Tågnamn: ${bookingInformation[5]}<br>
</p></div>

<footer><h3>
Tack för att du väljer att resa med oss!</h3>
<h3>- Trainify</h3>
</footer >
</div>
</div>
</div>
</div>
</html>
`;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'trainteam14@gmail.com',
      pass: '@Trainteam1',
    },
  });
  console.log('mailer: ' + bookingInformation);
  // send mail with defined transport object

  mailOptions = {
    from: '"Trainify Team" <trainteam14@gmail.com>', // sender address
    to: `${bookingInformation[0]}`, // list of receivers
    subject: 'Bokningsbekräftelse', // Subject line
    text: 'none graphical text', // plain text body
    html: output, // html body
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log('Error!' + err.message);
    }

    console.log('Message sent: %s', info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
  });
};
function getWeekday(date){
  const weekday = ["Söndag","Måndag","Tisdag","Onsdag","Torsdag","Fredag","Lördag"];
  var day = new Date(date);
  return weekday[day.getDay()];
};
