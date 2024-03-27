const dotenv = require("dotenv").config();
module.exports = {
    PORT: process.env.PORT || 5000,
    secret: process.env.JWT_SECRET_KEY,
    dbURL: process.env.DB_URI
};
