const nodemailer = require('nodemailer');

exports.sendEmail = async (to, subject, attachmentFilePath) => {
  await mailClient.sendMail({
    from: 'cristea.r.andrei@gmail.com',
    to: to,
    subject: subject,
    attachments: [{ path: attachmentFilePath }],
  });
};

exports.sendMultipleAttachmentEmails = async (pdfAttachmentsToSend, settings) => {
  console.log(`Sending ${pdfAttachmentsToSend.length} emails`);
  const mailClient = nodemailer.createTransport({
    host: settings.smtpHost,
    port: settings.smtpPort,
    auth: {
      user: settings.smtpUsername,
      pass: settings.smtpPassword,
    },
  });
  for (let index = 0; index < pdfAttachmentsToSend.length; index++) {
    const info = pdfAttachmentsToSend[index];
    await mailClient.sendMail({
      from: settings.smtpUsername,
      to: info.to,
      subject: settings.emailSubject,
      attachments: [{ path: info.filePath }],
    });
    console.log(`Email sent to ${info.to}`);
  }
};
