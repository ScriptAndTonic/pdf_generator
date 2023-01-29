const pdfTemplateFilePicker = document.querySelector('#pdf-template-file-picker');
const excelDataFilePicker = document.querySelector('#excel-data-file-picker');
const saveLocationFilePicker = document.querySelector('#save-location-file-picker');
const sendEmailsCheckbox = document.querySelector('#send-emails-checkbox');
const submitButton = document.querySelector('#submit-btn');
const settingsButton = document.querySelector('#settings-btn');
let outputDirectoryPath = '';
validateForm();

submitButton.onclick = generatePDFs;
settingsButton.onclick = openSettingsPage;

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

saveLocationFilePicker.onclick = () => {
  window.electronAPI.selectFolder().then((saveLocation) => {
    outputDirectoryPath = saveLocation;
    const folderName = document.querySelector('#save-location-file-picker-container .file-name');
    folderName.textContent = saveLocation;
    validateForm();
  });
};

function validateForm() {
  submitButton.disabled = pdfTemplateFilePicker.files.length === 0 || excelDataFilePicker.files.length === 0 || outputDirectoryPath === '';
}

async function generatePDFs(e) {
  e.preventDefault();
  const pdfTemplateFilePath = pdfTemplateFilePicker.files[0].path;
  const excelDataFilePath = excelDataFilePicker.files[0].path;
  if (pdfTemplateFilePath != undefined && excelDataFilePath != undefined && outputDirectoryPath != undefined) {
    submitButton.classList.add('is-loading');
    const result = await window.electronAPI.generatePDFs({
      pdfTemplateFilePath: pdfTemplateFilePath,
      excelDataFilePath: excelDataFilePath,
      outputDirectoryPath: outputDirectoryPath,
      sendEmails: sendEmailsCheckbox.checked,
    });
    console.log(result);
    submitButton.classList.remove('is-loading');
    if (result === 'Success') {
      submitButton.innerText = 'Done';
      submitButton.classList.remove('is-info');
      submitButton.classList.add('is-success');
    } else {
      submitButton.innerText = 'Failed';
      submitButton.classList.remove('is-info');
      submitButton.classList.add('is-danger');
    }
    setTimeout(() => {
      submitButton.innerText = 'Submit';
      submitButton.classList.remove('is-success');
      submitButton.classList.remove('is-danger');
      submitButton.classList.add('is-info');
    }, 3000);
  }
}

async function openSettingsPage(e) {
  e.preventDefault();
  const result = await window.electronAPI.openSettingsPage();
}
