const express=require('express');
const bodyParser=require('body-parser');

const PORT=3000;
const app=express();
let rooms=[
    {roomName:"Brooklyn",roomId:1,seatCapacity:10,pricePerHour:"$100",facilities:["AC","Presentation Setup","Coffee Maker", "Mic and Speakers"]}
    ,{roomName:"Nile",roomId:2,seatCapacity:20,pricePerHour:"$150",facilities:["AC","Presentation Setup","Coffee Maker", "Mic and Speakers"]}
];

let bookedDetails=[]; let customerBookings=[];

let customer=[
    {customerName:"Jhimmy",roomName:"Nile",roomId:2,date:"20/9/2023",startTime:"10.00 Hrs",endTime:"13.00 Hrs"},
    
    {customerName:"Ben",roomName:"Ninja",roomId:4,date:"22/9/2023",startTime:"12.00 Hrs",endTime:"20.00 Hrs"}
]

app.use(bodyParser.json());

function checkAvailablity(roomId, date, startTime, endTime) {
    return !customer.some(
      (b) =>
        b.roomId === roomId &&
        b.date === date &&(
        (startTime >= b.startTime && startTime < b.endTime) ||
        (endTime > b.startTime && endTime <= b.endTime) ||
        (startTime <= b.startTime && endTime >= b.endTime)
          )
    );
  }

app.post('/rooms',(req,res)=>{
    const newRoom=req.body;
    if(!newRoom.roomName || !newRoom.roomId || !newRoom.seatCapacity || !newRoom.pricePerHour || !newRoom.facilities){
        res.status(500).send("Needed all Details of the Hall")
    }
    rooms.push(newRoom);
    res.status(201).send("Hall info added successful");
})

app.get('/rooms',(req,res)=>{
    res.json(rooms);
});


app.get('/rooms/booking',(req,res)=>{
    let result = rooms.map((r)=>{
        let cnf = customer.find((c)=>c.roomId===r.roomId);
        return {
            customerName: cnf? cnf.customerName : null,
            roomName:`${r.roomName}`,
            roomStatus: cnf?"Booked" : "Available",
            date: cnf? cnf.date: null,
            startTime: cnf?cnf.startTime: null,
            endTime:cnf?cnf.endTime:null

        };
    });
    bookedDetails.push(result);

    res.json(result);
});

app.post('/customer',(req,res)=>{
    const newCus=req.body;
    if(!newCus.customerName || !newCus.roomName || !newCus.roomId || !newCus.date || !newCus.startTime || !newCus.endTime){
        res.status(500).send("Needed all Details for Hall Booking")
    }

    if (!checkAvailablity(roomId, date, startTime, endTime)) {
        return res.status(400).json({ error: "Room is already booked for the Slot." });
      }

    customer.push(newCus);
    res.status(201).send("Booking Customer info added successful");
})

app.get('/customer',(req,res)=>{
    res.json(customer);
})


app.get('/customer/booking',(req,res)=>{
    let result = customer.map((r)=>{
        let cnf = customer.find((c)=>c.customerName===r.customerName);
        return {
            customerName:cnf.customerName ,
            roomName: cnf?`${r.roomName}`:null,
            roomStatus: cnf?"Booked" : "Available",
            date: cnf? cnf.date: null,
            startTime: cnf?cnf.startTime: null,
            endTime:cnf?cnf.endTime:null

        };
    });
    customerBookings.push(result);

    res.json(result);
});

app.get('/customer/bookingcount',(req,res)=>{
    let {customerName}=req.query;
    let bookingCount=customer.filter((e)=>e.customerName===customerName);
    res.json({ customerName, bookingCounts:bookingCount.length, booked: bookingCount})
})





app.listen(PORT,()=>{console.log('Server is running in ',PORT);})