const express = require('express');
const app = express();
const cors = require('cors');
const  moment = require('moment');
var tzemoment = require('moment-timezone');
tzemoment().tz("Australia/Melbourne").format();

require('./src/db/mongoose')

const Seatinfo = require('./src/model/seatinfo')

app.use(cors());
app.use(express.json())



app.post('/seatinfo', (req, res) => {
    const seat = new Seatinfo(req.body)
    console.log(req.body);

    seat.save().then(() => {
      console.log("Succesfully Connected to DB: Seatinfo Post");
      res.status(200).send(seat)
    }).catch((err) => {
      res.status(400).send("Error occured"+err)
    })
})





app.get('/seatinfo', (req, res) => {
  updateAvailableSeat();
  Seatinfo.find({}).then((users)=>{
    console.log("Succesfully Connected to DB: getSeatInfo");
    res.send(users)
  }).catch((e) =>{
    res.send("error occured"+e)
  })
})


app.patch('/scheduleleaves', (req, res) => {
  console.log(req.body);
  const filter = req.body.seatownedby;
  const start = req.body.leavestartdate;
  const end = req.body.leaveenddate;
  console.log(filter,start,end);

  Seatinfo.findOneAndUpdate( 
    {seatownedby: filter}, 
    {$set:{leavestartdate: start, leaveenddate: end}},
    { new: true })
    .then((data) => {
      console.log("Succesfully Connected to DB : scheduleleaves",data);
      res.status(200).send(data)
  }).catch((e) =>{
    res.status(400).send("Error occured"+err)
  })
})





app.patch('/booking', (req, res) => {
  console.log(req.body);
  const filter = req.body.seatownedby;
  const bookedbyuser = req.body.seatbookedby;
  var status = "booked";
  if (req.body.bookingstatus === 'notavailable'){
    status = 'notavailable';
  }
  if (req.body.bookingstatus === 'Available'){
    status = 'Available';
  }
  console.log(filter,bookedbyuser, status);

  Seatinfo.findOneAndUpdate( 
    {seatownedby: filter}, 
    {$set:{seatbookedby: bookedbyuser, bookingstatus: status }},
    { new: true })
    .then((data) => {
      console.log("Succesfully Connected to DB : booking",data);
      res.status(200).send(data)
  }).catch((e) =>{
    res.status(400).send("Error occured"+err)
  })
})


function updateAvailableSeat() {
  Seatinfo.find({}).then((users)=>{
    console.log("Succesfully Connected to DB: updateAvailableSeat",moment().format());
    var dateFormat = 'YYYY-DD-MM HH:mm:ss';
    var testDateUtc = moment.utc(moment().format());
    var localDate = moment().utcOffset(10);

    console.log("Succesfully Connected to DB: tzemoment",tzemoment().format());
    //var now = tzemoment().format("YYYY-MM-DD");
    
    var now = localDate.format("YYYY-MM-DD");
    console.log("Suja testDateUtc",testDateUtc);
    console.log("Suja localDate",localDate);
    console.log("Suja now",now);

    for (const key in users) {
      var leavestart = moment(users[key].leavestartdate).format("YYYY-MM-DD");
      var leaveend = moment(users[key].leaveenddate).format("YYYY-MM-DD");
     
      console.log("Ramesh Connected to DB: leavestart",users[key].seatownedby);
      console.log("Ramesh Connected to DB: leavestart",leavestart);
      console.log("Ramesh Connected to DB: leaveend",leaveend);
      console.log("Ramesh Connected to DB: tzemoment leavestart",moment(leavestart).format("YYYY-MM-DD"));
      console.log("Ramesh Connected to DB: tzemoment leavestart",moment(leaveend).format("YYYY-MM-DD"));

      if(moment(leavestart).isSameOrBefore(now,'day') && moment(leaveend).isSameOrAfter(now,'day')) {
        console.log("updating Available Seat for user",users[key].seatownedby);
        if(users[key].bookingstatus.toLowerCase() !== 'booked'
         && users[key].bookingstatus.toLowerCase() !== 'available'){
          console.log("Marking as Avaliable",users[key].bookingstatus.toLowerCase());

          Seatinfo.findOneAndUpdate( 
            {seatownedby: users[key].seatownedby}, 
            {$set:{bookingstatus: 'Available' }},
            { new: true })
            .then((data) => {
              console.log("Succesfully Connected to DB : updateAvailableSeat: updating booking status",data);
          }).catch((e) =>{
              console.log("Error occured"+err)
          })
        }
        console.log("bookingstatus",users[key].bookingstatus.toLowerCase()); 
      }

      if((users[key].bookingstatus.toLowerCase() === "booked" 
        || users[key].bookingstatus.toLowerCase() === "available")  
        && moment(leaveend).isBefore(now,'day')){
        console.log("Available Seat for user booked ",users[key].seatownedby);
        Seatinfo.findOneAndUpdate( 
          {seatownedby: users[key].seatownedby}, 
          {$set:{bookingstatus: 'notavailable', seatbookedby: '' }},
          { new: true })
          .then((data) => {
            console.log("Succesfully Connected to DB : updateAvailableSeat: updating booking status",data);
        }).catch((e) =>{
            console.log("Error occured"+err)
        })
      }
    }

  }).catch((e) =>{
    console.log("error occured"+e)
  })

}





// Start server
var port = process.env.PORT || 8080;
app.listen(port, () => console.log(`App listening on port ${port}!`));

