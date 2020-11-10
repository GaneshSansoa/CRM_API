//Core Modules Import
const express = require("express");
const dotenv = require("dotenv");
const app = express();
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const fileupload = require("express-fileupload");
const path = require("path");
//DB Import
const connectDB = require("./config/db");

//Routers
const auth = require("./routers/auth");
const orders = require("./routers/orders");
const user = require("./routers/users");
const mail = require("./routers/mail");
const employee = require("./routers/employees");
//Helper Functions
const { logger } = require("./middlewares/logger");
const errorHandler = require("./middlewares/errorHandler");

//Enviornment Variables Path
dotenv.config({path: "./config/config.env"});

//MongoDB Connect
connectDB();

//Parse Json Data
app.use(express.json());
//Parse Cookie Parser
app.use(cookieParser());


//Logger
if(process.env.NODE_ENV === "development"){
    app.use(morgan('dev'));
}

//FileUploader for Multipart/Formdata
app.use(fileupload());

//Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

//Routes
app.use("/api/v1/auth", auth);
app.use("/api/v1/orders", orders);
app.use("/api/v1/user", user);
app.use("/api/v1/mail", mail);
app.use("/api/v1/employees", employee);

//Error Handling MiddleWare
app.use(errorHandler);


//PORT
const PORT = process.env.PORT || 5000;


//RUN the Application
app.listen(PORT, console.log(`App is listening on PORT ${PORT} and running in ${process.env.NODE_ENV}`));