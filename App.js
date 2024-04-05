const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cron = require('node-cron');
const nodemailer = require('nodemailer');
const cors = require('cors');
const config = require('./config/config');
const adminRoutes = require('./routes/adminRoutes');
const employeeRoutes = require("./routes/employeeRoutes");
const { getAllInventory, fetchInventory } = require('./controller/adminController');
const generateEmailTemplate = require('./MailServices/generateEmailTemplate');
const { sendEmail } = require('./MailServices/InvertoryMail');
const dotenv = require("dotenv").config();
const app = express();

// Middleware
app.use(cors()); // Enable CORS
app.use(bodyParser.json()); // Parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Routes
app.use('/admin', adminRoutes);
app.use("/employee", employeeRoutes);
// Schedule cron job to run at 12:00 AM PST every day
cron.schedule('* * * * *', async () => {
    try{
        const inventoryData = await  fetchInventory();
        if(inventoryData.length > 0) {
             // console.log("1", data);
         // Generate email template
         const emailContent = generateEmailTemplate(inventoryData);
         // Send email
        await sendEmail(emailContent);
        
        }
       return;
    }catch(error){
        console.log(
        error
        )
    }
});


// Connect to MongoDB
mongoose.connect(config.dbURL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        app.listen(config.PORT, ()=>{
            console.log(`APP Running on http://localhost:${config.PORT}`);
        })
    })
    .catch(err => console.error('Error connecting to MongoDB:', err));

module.exports = app;

