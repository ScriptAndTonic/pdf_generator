const fs = require('fs');
const { PDFDocument } = require('pdf-lib');
const ExcelJS = require('exceljs');

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
