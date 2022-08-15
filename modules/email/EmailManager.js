const nodemailer = require('nodemailer');

const emailTransport = nodemailer.createTransport({
    service: "gmail", // no need to set host or port etc.
    auth: {
        user: process.env.GMAIL_USERNAME,
        pass: process.env.GMAIL_PASSWORD
    }
});

const sendEmail = (recipients, { subject, template }) => {
    const letterPayload = {
        from: process.env.GMAIL_USERNAME,
        to: recipients,
        subject,
        html: template
    };
    return emailTransport.sendMail(letterPayload);

};

module.exports = { sendEmail };