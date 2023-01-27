const fs = require('fs');
const { PDFDocument, PDFName, PDFNumber } = require('pdf-lib');
const ExcelJS = require('exceljs');

exports.generatePDFs = async (templatePath, dataFilePath, outputPath) => {
  const inputWorksheet = await readXlsxFile(dataFilePath);
  const colNames = inputWorksheet.columns.map((col) => col.key);
  const pdfFillInfos = [];
  inputWorksheet.eachRow(async (row, rowNumber) => {
    if (row) {
      const pdfFillInfo = {};
      colNames.forEach((colName) => {
        pdfFillInfo[colName] = row.getCell(colName).text;
      });
      pdfFillInfos.push(pdfFillInfo);
    }
  });

  for (let index = 0; index < pdfFillInfos.length; index++) {
    const pdfFillInfo = pdfFillInfos[index];
    await fillPdf(templatePath, outputPath, pdfFillInfo);
  }
};

const fillPdf = async (templateFilePath, outputPath, pdfFillInfo) => {
  let outputFilePath = '';
  const templateFile = fs.readFileSync(templateFilePath);
  const pdf = await PDFDocument.load(templateFile);
  const form = pdf.getForm();
  console.log(
    `PDF Form fields: ${form
      .getFields()
      .map((field) => field.getName())
      .reduce((accumulator, currentVal) => accumulator + ', ' + currentVal)}`
  );
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
        form.getField(key).setText(value);
        break;
    }
  });
  form.flatten();
  const pdfBytes = await pdf.save();
  fs.writeFileSync(outputFilePath, pdfBytes);
};

const readXlsxFile = async (filePath) => {
  const workbook = new ExcelJS.Workbook();
  const wb = await workbook.xlsx.readFile(filePath, { headers: true });
  const worksheet = wb.worksheets[0];
  worksheet.columns = worksheet.getRow(1).values.map((val) => ({ header: val, key: val, width: 10 }));
  worksheet.spliceRows(1, 1);
  return worksheet;
};
