import { detailedDiff } from 'deep-object-diff';
import getOldColors from './services/getOldColors';
import isColorChange from './services/isColorChange';
import './ui.css';
import displayReviewPanel from './views/review';
import updateRemoteColors from './services/updateRemoteColors';

const state = {
  newColors: {},
  encodedColorsFile: {
    sha: ''
  },
  userName: '',
  userEmail: '',
  commitSha: 'b1b2ec91017645a628f488c8b79d611e2173276f'
};

const nameInput = document.getElementById('name-input') as HTMLInputElement;
const emailInput = document.getElementById('email-input') as HTMLInputElement;

document.getElementById('send-style-changes').onsubmit = e => {
  e.preventDefault();
  // update user info
  const newUserName = nameInput.value;
  const newUserEmail = emailInput.value;
  if (newUserName !== state.userName || newUserEmail !== state.userEmail) {
    state.userName = newUserName;
    state.userEmail = newUserEmail;
    parent.postMessage(
      {
        pluginMessage: {
          type: 'SAVE_USER_INFO',
          newUserName,
          newUserEmail
        }
      },
      '*'
    );
  }
  // get new colors
  parent.postMessage({ pluginMessage: { type: 'GET_NEW_COLORS' } }, '*');
};

document.getElementById('validate').onclick = async e => {
  e.preventDefault();

  //send colors to Repo
  console.log('New Colors to send to repo', state.newColors);
  const tokenInput: HTMLInputElement = document.getElementById(
    'token'
  ) as HTMLInputElement;
  const token = tokenInput.value;

  // const PRLink = await updateRemoteColors(state.newColors, {
  //   token,
  //   sha: state.encodedColorsFile.sha,
  //   userName: state.userName,
  //   userEmail: state.userEmail
  // });

  const PRLink = 'https://github.com/Dashlane/Figma-UI-Sync';

  document.getElementById('confirmation-panel').style.display = 'none';
  document.getElementById('success-panel').style.display = 'block';
  const txtArea = document.getElementById(
    'pull-request-input'
  ) as HTMLTextAreaElement;
  txtArea.value = PRLink;
  document.getElementById('pull-request-link').setAttribute('href', PRLink);
  document.getElementById('pull-request-link').textContent = PRLink;
};

document.getElementById('back-step-1').onclick = async e => {
  e.preventDefault();
  document.getElementById('send-style-changes').style.display = 'block';
  document.getElementById('review-panel').innerHTML = '';
  document.getElementById('confirmation-panel').style.display = 'none';
};
document.getElementById('back-step-1-bis').onclick = async e => {
  e.preventDefault();
  document.getElementById('send-style-changes').style.display = 'block';
  document.getElementById('review-panel').innerHTML = '';
  document.getElementById('confirmation-panel').style.display = 'none';
  document.getElementById('success-panel').style.display = 'none';
};

document.getElementById('copy-url-button').addEventListener('click', e => {
  /* Get the text field */
  var copyText = document.getElementById(
    'pull-request-input'
  ) as HTMLTextAreaElement;

  /* Select the text field */
  copyText.select();

  /* Copy the text inside the text field */
  document.execCommand('copy');

  /* Alert the copied text */
  document.getElementById('url-copied').style.display = 'inline-block';
  setTimeout(() => {
    document.getElementById('url-copied').style.display = 'none';
  }, 3000);
});

onmessage = async event => {
  const { pluginMessage } = event.data;
  switch (pluginMessage.type) {
    case 'GET_STORED_USER_INFO':
      // Fill the user info from localStorage
      if (pluginMessage.name) {
        state.userName = pluginMessage.name;

        nameInput.value = state.userName;
      }
      if (pluginMessage.email) {
        state.userEmail = pluginMessage.email;
        emailInput.value = state.userEmail;
      }
      break;
    case 'NEW_COLORS':
      state.newColors = pluginMessage.newColors;
      const { oldColors, encodedColorsFile } = await getOldColors();
      state.encodedColorsFile = encodedColorsFile;

      const colorDiff = detailedDiff(oldColors, state.newColors);
      if (isColorChange(colorDiff)) {
        document.getElementById('send-style-changes').style.display = 'none';
        displayReviewPanel(colorDiff, oldColors);
      }
      break;
  }
};
