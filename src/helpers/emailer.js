const nodemailer = require('nodemailer');
const mailClient = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  auth: {
    user: process.env.GMAIL_USERNAME,
    pass: process.env.GMAIL_PASS,
  },
});

exports.sendEmail = async (to, subject, attachmentFilePath) => {
  await mailClient.sendMail({
    from: 'cristea.r.andrei@gmail.com',
    to: to,
    subject: subject,
    attachments: [{ path: attachmentFilePath }],
  });
};
