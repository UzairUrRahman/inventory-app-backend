const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const config = require('./config/config');
const adminRoutes = require('./routes/adminRoutes');
const employeeRoutes = require("./routes/employeeRoutes");
const dotenv = require("dotenv").config();
const app = express();

// Middleware
app.use(cors()); // Enable CORS
app.use(bodyParser.json()); // Parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Routes
app.use('/admin', adminRoutes);
app.use("/employee", employeeRoutes);

// Connect to MongoDB
mongoose.connect(config.dbURL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        app.listen(config.PORT, ()=>{
            console.log(`APP Running on http://localhost:${config.PORT}`);
        })
    })
    .catch(err => console.error('Error connecting to MongoDB:', err));



