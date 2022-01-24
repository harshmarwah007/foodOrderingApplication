const mongoose = require("mongoose");
require('dotenv').config()
mongoose.connect(process.env.CONNECTION_URL, 
    { useNewUrlParser: true, useUnifiedTopology: true }).then(()=>{
console.log("Connection Successful")
}).catch(()=>{
    console.log("Connection not Successful")
})


