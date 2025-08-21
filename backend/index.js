const db = require('./model');
const express = require("express");
//cors is use for security puropse to inly allo the specific domain and block other 
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors({ origin: "*" }));// it allows all addresses
const port = 8000;
const { Op } = require("sequelize");

app.listen(port, () => {
  console.log(`Server started on server ${port}`);
});
db.sequelize
  .authenticate()
  .then(() => console.log("Database connected successfully!"))
  .catch(err => console.error("Unable to connect to database:", err));
app.get("/", (req, res) => {
  res.send("Server started !");
});
//booking api
app.post("/booking", async (req, res) => {
  console.log("booking api called");
 try{

 
  const { firstName, lastName,start_date,end_date,vehicle_id } = req.body;
  console.log("Details",req.body)
  if(!firstName) return res.json({ error: true, message: "Name is Required" })
  if(!lastName)return res.json({ error: true, message: "Last nam is required" })
  if(!start_date)return res.json({ error: true, message: "startdate is Required" })
  if(!end_date) return res.json({ error: true, message: "end_date is required" })
     if(!vehicle_id) return res.json({ error: true, message: "end_date is required" })
console.log("finding the exsiting booking");
const existingBooking = await db.booking.findAll({
  where: {
    vehicle_id: vehicle_id,  
    [Op.or]: [
      { start_date: { [Op.between]: [start_date, end_date] } },
      { end_date: { [Op.between]: [start_date, end_date] } },
      { start_date: { [Op.lte]: start_date }, end_date: { [Op.gte]: end_date } }
    ]
  }
})

if (existingBooking.length>0) {
  console.log("vehicle is alredy booked");
  return res.json({
    error: true,
    message: "This vehicle is already booked for selected dates!"
  });
}
    const booking=await db.booking.create({
    firstName,lastName,start_date,end_date,vehicle_id
      })
      console.log("inserted the data sucessfully");
      return res.json({
      error: false,
      message: "Booking created successfully",
      data: booking,
    });


  
}catch(error)
{
  console.log("error found",error);

}

  return res.json({ error: false, message: "Booking api called succesfully" })
  
});


// get vehicle types based on number of wheels
app.get("/api/vehicle-types", async (req, res) => {
  console.log("Inside the vechicle-type api");
  try {
    const { wheels } = req.query;

    if (!wheels) {
      return res.status(400).json({ error: true, message: "Wheels parameter is required" });
    }

    // Fetch from DB
    const vehicleTypes = await db.vehicleType.findAll({
      where: { wheels: wheels },  
      attributes: ["name"]        
    });
    console.log("Data from the databse",vehicleTypes);

    if (!vehicleTypes || vehicleTypes.length === 0) {
      return res.status(404).json({ error: true, message: "No vehicle types found for given wheels" });
    }else{
      console.log("Sending the data");
      return res.json({
    error: false,
    message: "Suceesfully fetched the data!",vehicleTypes
  });

    }  
  } catch (error) {
    console.error("Error fetching vehicle types:", error);
    return res.status(500).json({ error: true, message: "Server error" });
  }
});

