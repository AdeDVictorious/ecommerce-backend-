const nodemailer = require('nodemailer');

const sendEmail = (options) => {
  //create a transporter
  const transporter = nodemailer.createTransport({
    // service: "Gmail",   //for gmail use only
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAil_PASSWORD,
    },
  });

  //Define the email options
  const mailOptions = {
    from: 'SCUBED FRUIT JUICES <scubedjuice@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html:
  };
  //send the email
  transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
