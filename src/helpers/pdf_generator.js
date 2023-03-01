const fs = require('fs');
const { PDFDocument } = require('pdf-lib');
const ExcelJS = require('exceljs');

exports.generatePDFs = async (pdfGenerationInfo) => {
  const inputWorksheet = await readXlsxFile(pdfGenerationInfo.excelDataFilePath);
  const colNames = inputWorksheet.columns.map((col) => col.key);
  const pdfContentsToGenerate = [];
  inputWorksheet.eachRow((row, _rowNumber) => {
    if (row) {
      const pdfContent = {};
      colNames.forEach((colName) => {
        pdfContent[colName] = row.getCell(colName).text;
      });
      pdfContentsToGenerate.push(pdfContent);
    }
  });

  const pdfAttachmentsToSend = [];
  for (let index = 0; index < pdfContentsToGenerate.length; index++) {
    const pdfContent = pdfContentsToGenerate[index];
    const generatedFilePath = await fillPdf(pdfGenerationInfo.pdfTemplateFilePath, pdfGenerationInfo.outputDirectoryPath, pdfContent);
    if (pdfContent.send_email_to) {
      pdfAttachmentsToSend.push({ filePath: generatedFilePath, to: pdfContent.send_email_to });
    }
  }

  return pdfAttachmentsToSend;
};

const fillPdf = async (templateFilePath, outputPath, pdfFillInfo) => {
  let outputFilePath = '';
  const templateFile = fs.readFileSync(templateFilePath);
  const pdfDoc = await PDFDocument.load(templateFile);
  const form = pdfDoc.getForm();
  Object.entries(pdfFillInfo).forEach((entry) => {
    const [key, value] = entry;
    switch (key) {
      case 'file_name':
        outputFilePath = `${outputPath}/${value}.pdf`;
        break;
      case 'send_email_to':
        console.log(`Send email to ${value}`);
        break;
      default:
        const field = form.getField(key);
        field.setText(value);
        break;
    }
  });
  form.flatten();
  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync(outputFilePath, pdfBytes);
  return outputFilePath;
};

const readXlsxFile = async (filePath) => {
  const workbook = new ExcelJS.Workbook();
  const wb = await workbook.xlsx.readFile(filePath, { headers: true });
  const worksheet = wb.worksheets[0];
  worksheet.columns = worksheet.getRow(1).values.map((val) => ({ header: val, key: val, width: 10 }));
  worksheet.spliceRows(1, 1);
  return worksheet;
};
