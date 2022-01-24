const express = require("express");
const app = express();
const cors = require("cors")
const bodyParser = require("body-parser");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
const MongoStore = require("connect-mongo")
require("./src/db/conn")
require('dotenv').config()



//Passport config
require("./src/config/passport")



const port = process.env.PORT || 3000
const authRoutes =  require("./src/routes/auth");
const foodRoutes = require("./src/routes/food");

// middlewares 
app.use(cors())
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json())
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    store:MongoStore.create({mongoUrl:process.env.CONNECTION_URL,collectionName:"sessions"}),
    cookie: { maxAge: 1000*60*60*24 }
  }))

//Flash
app.use(flash())
//Global Variables
app.use((req,res,next)=>{
    res.locals.success_msg = req.flash("Success_Message");
    res.locals.error_msg = req.flash("Error_Message");
    next();
})
//Passport middleware
app.use(passport.initialize());
app.use(passport.session());
app.use("/user",authRoutes);
app.use("/food",foodRoutes);

app.get("/",(req,res)=>{
    res.send("Harsh Marwah")
})

app.listen(port,()=>{
    console.log("server is running ",port)
})