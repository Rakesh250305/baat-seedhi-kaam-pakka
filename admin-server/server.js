const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const app = express();

dotenv.config();
const connectDB = require('./config/db');
const adminRoutes = require('./routes/adminRoutes');

app.use(cors());
app.use(express.json());
app.use("/admin", adminRoutes);
app.use("/", (req,res)=>{
    res.status(200).json({message:"Admin server is running"});
});

connectDB()
  .then(()=>{
    app.listen(process.env.PORT,()=>{
        console.log(`Server is running on port ${process.env.PORT}`);
    })})
  .catch(err=>{
        console.error("Error starting the server:", err);
    });