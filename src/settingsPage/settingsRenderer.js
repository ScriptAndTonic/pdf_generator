const form = document.querySelector('form');
const smtpHostInput = document.querySelector('#smtp-host-input-container input');
const smtpPortInput = document.querySelector('#smtp-port-input-container input');
const smtpUserInput = document.querySelector('#smtp-user-input-container input');
const smtpPassInput = document.querySelector('#smtp-pass-input-container input');
const cancelBtn = document.querySelector('#cancel-btn');

function collectSettings() {
  if (smtpHostInput.value !== '' && smtpPortInput.value !== '' && smtpUserInput.value !== '' && smtpPassInput.value !== '') {
    return { host: smtpHostInput.value, port: smtpPortInput.value, user: smtpUserInput.value, pass: smtpPassInput.value };
  }
}

form.onsubmit = (e) => {
  e.preventDefault();
  const settings = collectSettings();
  if (settings) {
    console.dir(settings);
  }
};

cancelBtn.onclick = () => {
  window.close();
};
