const nodemailer = require('nodemailer');
const dotenv = require("dotenv").config;
exports.sendEmail = async (htmlContent) => {
    // Create a transporter using SMTP transport
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com', // Your SMTP server host
        port: 587, // Your SMTP server port
        secure: false, // Set to true if your SMTP server requires SSL
        auth: {
            user: process.env.USER_EMAIL, // Your email address
            pass: process.env.USER_APP_PASSWORD // Your email password or app-specific password
        }
    });

    // Email options
    const mailOptions = {
        from: process.env.USER_EMAIL,
        to: 'nicoledawn8989@aol.com',
        subject: 'Inventory Report',
        html: htmlContent
    };

    // Send email
    try {
        const info = await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};
