const db = require('../model');

async function seed() {
  console.log("inside seed.js");
    await db.sequelize.sync();
  
  
 await db.vehicleType.bulkCreate([
      {  name: 'Hatchback', wheels: 4 },
     { name: 'SUV', wheels: 4 },
       { name: 'Sedan', wheels: 4 },
       { name: 'Cruiser', wheels: 2 },
      
    
   
]);
  await db.vehicle.bulkCreate([
   
   {type_id: 1, model_name: 'Honda Fit'},
    { type_id: 2, model_name: 'Ford Explorer' },
   
    {  type_id: 3, model_name: 'Honda Amaze' },
    
    {  type_id: 4, model_name: 'Bajaj Avenger' },   

  ]);

  console.log("Seeding complete.");
}

seed();
