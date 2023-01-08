const form = document.querySelector('#pdf-generator-form');
const pdfTemplateFilePicker = document.querySelector('#pdf-template-file-picker');
const excelDataFilePicker = document.querySelector('#excel-data-file-picker');

form.addEventListener('submit', generatePDFs);

pdfTemplateFilePicker.onchange = () => {
  if (pdfTemplateFilePicker.files.length > 0) {
    const fileName = document.querySelector('#pdf-template-file-picker-container .file-name');
    fileName.textContent = pdfTemplateFilePicker.files[0].name;
  }
};

excelDataFilePicker.onchange = () => {
  if (excelDataFilePicker.files.length > 0) {
    const fileName = document.querySelector('#excel-data-file-picker-container .file-name');
    fileName.textContent = excelDataFilePicker.files[0].name;
  }
};

function generatePDFs(e) {
  e.preventDefault();
  console.log('Renderer received');
  const pdfTemplateFilePath = pdfTemplateFilePicker.files[0].path;
  console.log(`Template Path: ${pdfTemplateFilePath}`);
  const excelDataFilePath = excelDataFilePicker.files[0].path;
  console.log(`Data File Path: ${excelDataFilePath}`);
  window.electronAPI.selectFolder().then((outputDirectoryPath) => {
    console.log(`Output Directory Path: ${outputDirectoryPath}`);
    window.electronAPI.generatePDFs(pdfTemplateFilePath, excelDataFilePath, outputDirectoryPath);
  });
}
