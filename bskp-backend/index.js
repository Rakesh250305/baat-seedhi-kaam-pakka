const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const app = express();

app.use("/",(req,res)=>res.send("Welcome to the Baat Seedhi Kaam Pakka Backend"));

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});