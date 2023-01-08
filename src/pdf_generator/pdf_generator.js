const fs = require('fs');
const { PDFDocument } = require('pdf-lib');
const ExcelJS = require('exceljs');
// const nodemailer = require('nodemailer');
// const mailClient = nodemailer.createTransport({
//   host: 'smtp.gmail.com',
//   port: 465,
//   auth: {
//     user: process.env.GMAIL_USERNAME,
//     pass: process.env.GMAIL_PASS,
//   },
// });

exports.generatePDFs = async (templatePath, dataFilePath, outputPath) => {
  const inputWorksheet = await readXlsxFile(dataFilePath);
  inputWorksheet.eachRow(async (row, rowNumber) => {
    const values = [];
    let email = '';
    row.eachCell((cell, colNumber) => {
      if (colNumber == 1) {
        email = cell.text;
      } else {
        values.push(cell.text);
      }
    });
    const outputFileName = `${outputPath}/${rowNumber}.pdf`;
    await fillPdf(templatePath, outputFileName, values);
    // await sendEmail(email, 'Congratulations', outputFileName);
  });
};

const fillPdf = async (templateFilePath, outputFilePath, values) => {
  const templateFile = fs.readFileSync(templateFilePath);
  const pdf = await PDFDocument.load(templateFile);
  const form = pdf.getForm();
  const fields = form.getFields();
  values = values.reverse();
  for (let index = 0; index < values.length; index++) {
    const value = values[index];
    fields[index].setText(value);
  }
  const pdfBytes = await pdf.save();
  fs.writeFileSync(outputFilePath, pdfBytes);
};

const readXlsxFile = async (filePath) => {
  const workbook = new ExcelJS.Workbook();
  const wb = await workbook.xlsx.readFile(filePath);
  return wb.worksheets[0];
};

// const sendEmail = async (emailAddress, subject, attachmentFilePath) => {
//   await mailClient.sendMail({
//     from: 'cristea.r.andrei@gmail.com',
//     to: emailAddress,
//     subject: subject,
//     attachments: [{ path: attachmentFilePath }],
//   });
// };
