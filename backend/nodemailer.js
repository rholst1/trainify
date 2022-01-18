const nodemailer = require('nodemailer');

module.exports = function (bookingInformation) {
 let body = '';
 bookingInformation.forEach( ticket=>
//   body = body +
//   'Biljettnummer: '+ticket.TicketNumber + '<br>' +
//   'Pris: ' + ticket.Price + '<br>' + 
//   'Avresa:      ' + ticket.Departure +' - Tid för avgång:  '+ getWeekday(ticket.DepartureTime)+' '+ticket.DepartureTime+'<br>'+
//   'Destination: ' + ticket.Arrival+' - Tid för ankomst: '+ getWeekday(ticket.ArrivalTime)+ ' '+ ticket.ArrivalTime+'<br>'+
//   'Vagn: ' + ticket.WagonNr+'<br>'+
//   'Sittplats: '+ticket.SeatNr+'<br>'+
//   'Tågnummer: '+ticket.TrainId+'<br>'+
//   'Tågnamn: '+ ticket.Name+'<br><br>'
// );
body = body +
'Biljettnummer: '+ticket.TicketNumber + '<br>' +
'Pris: ' + ticket.Price + '<br>' + 
'Avresa:      ' + ticket.Departure +' - Tid för avgång:  <br>'+
'Destination: ' + ticket.Arrival+' - Tid för ankomst: <br>'+
'Vagn: ' + ticket.WagonNr+'<br>'+
'Sittplats: '+ticket.SeatId+'<br>'+
'Tågnummer: '+ticket.TrainId+'<br>'+
'Tågnamn: '+ ticket.Name+'<br><br>'
);
  const output = `
  <!DOCTYPE html>
<html lang="en">
  <div name="main" style="background-color: #e0d6c4; padding-right: 30vh ">
 
 <div name=innerContainer style="padding: 1vh">
 <div name=mainContainer style="padding-left: 10vh; background-color: whitesmoke; padding: 1vh">
<div name="header" style="padding: 0"><h2><p>Bokningsbekräftelse</p></h2></div>
<div name="subject"><h3>Tack för din bokning, se dina biljetter nedan.</p></h3><br></div>
<div name="ticket" display=flex style="color:Black;"><p name="ticketText">
${body}
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
  // send mail with defined transport object
  mailOptions = {
    from: '"Trainify Team" <trainteam14@gmail.com>', // sender address
    to: `${bookingInformation[0].email}`, // list of receivers
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
