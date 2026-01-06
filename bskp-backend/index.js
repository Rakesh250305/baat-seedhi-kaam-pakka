const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const app = express();

dotenv.config();
const connectDB = require('./config/db');
const { connect } = require('mongoose');


app.use("/",(req,res)=>res.send("Welcome to the Baat Seedhi Kaam Pakka Backend"));

connectDB()
  .then(()=>{
    app.listen(process.env.PORT,()=>{
        console.log(`Server is running on port ${process.env.PORT}`);
    })})
  .catch(err=>{
        console.error("Error starting the server:", err);
    });