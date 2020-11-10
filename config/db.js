const mongoose = require("mongoose");
const dotenv = require("dotenv");
const colors = require("colors");
dotenv.config({path: "./config.env"});
const connectDB = async() =>{ 

    const conn = await mongoose.connect(process.env.MONGO_DB_URI, {
       useNewUrlParser: true,
       useCreateIndex: true,
       useFindAndModify: true,
       useUnifiedTopology: true
   })
   console.log(`MongoDB connected with host ${conn.connection.host}`.cyan.underline);
} 

module.exports = connectDB;