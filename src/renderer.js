const form = document.querySelector('#pdf-generator-form');
const pdfTemplateFilePicker = document.querySelector('#pdf-template-file-picker');
const excelDataFilePicker = document.querySelector('#excel-data-file-picker');
const submitButton = document.querySelector('#submit-btn');
validateForm();

form.addEventListener('submit', generatePDFs);

pdfTemplateFilePicker.onchange = () => {
  if (pdfTemplateFilePicker.files.length > 0) {
    const fileName = document.querySelector('#pdf-template-file-picker-container .file-name');
    fileName.textContent = pdfTemplateFilePicker.files[0].name;
  }
  validateForm();
};

excelDataFilePicker.onchange = () => {
  if (excelDataFilePicker.files.length > 0) {
    const fileName = document.querySelector('#excel-data-file-picker-container .file-name');
    fileName.textContent = excelDataFilePicker.files[0].name;
  }
  validateForm();
};

function validateForm() {
  submitButton.disabled = pdfTemplateFilePicker.files.length === 0 || excelDataFilePicker.files.length === 0;
}

function generatePDFs(e) {
  e.preventDefault();
  const pdfTemplateFilePath = pdfTemplateFilePicker.files[0].path;
  const excelDataFilePath = excelDataFilePicker.files[0].path;
  window.electronAPI.selectFolder().then((outputDirectoryPath) => {
    if (pdfTemplateFilePath != undefined && excelDataFilePath != undefined && outputDirectoryPath != undefined) {
      window.electronAPI.generatePDFs(pdfTemplateFilePath, excelDataFilePath, outputDirectoryPath);
    }
  });
}
