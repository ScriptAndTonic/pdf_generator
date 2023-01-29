const form = document.querySelector('form');
const smtpHostInput = document.querySelector('#smtp-host-input-container input');
const smtpPortInput = document.querySelector('#smtp-port-input-container input');
const smtpUserInput = document.querySelector('#smtp-user-input-container input');
const smtpPassInput = document.querySelector('#smtp-pass-input-container input');
const emailSubjectInput = document.querySelector('#email-subject-input-container input');
const cancelBtn = document.querySelector('#cancel-btn');

function collectSettings() {
  return {
    smtpHost: smtpHostInput.value,
    smtpPort: smtpPortInput.value,
    smtpUsername: smtpUserInput.value,
    smtpPassword: smtpPassInput.value,
    emailSubject: emailSubjectInput.value,
  };
}

window.onload = async () => {
  const settings = await window.electronAPI.loadSettings();
  smtpHostInput.value = settings.smtpHost;
  smtpPortInput.value = settings.smtpPort;
  smtpUserInput.value = settings.smtpUsername;
  smtpPassInput.value = settings.smtpPassword;
  emailSubjectInput.value = settings.emailSubject;
};

form.onsubmit = async (e) => {
  e.preventDefault();
  const settings = collectSettings();
  if (settings) {
    await window.electronAPI.saveSettings(settings);
    window.close();
  }
};

cancelBtn.onclick = () => {
  window.close();
};
