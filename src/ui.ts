import { detailedDiff } from 'deep-object-diff';
import getOldColors from './services/getOldColors';
import isColorChange from './services/isColorChange';
import displayReviewPanel from './views/review';
import updateRemoteColors from './services/updateRemoteColors';
import './ui.css';
import './views/loader.css';

const state = {
  newColors: {},
  encodedColorsFile: {
    sha: ''
  },
  userName: '',
  userEmail: '',
  repository: '',
  colorsFilepath: '',
  branchRef: ''
};

const nameInput = document.getElementById('name-input') as HTMLInputElement;
const emailInput = document.getElementById('email-input') as HTMLInputElement;
const repositoryInput = document.getElementById(
  'repository-input'
) as HTMLInputElement;
const colorsFilepathInput = document.getElementById(
  'colorsfilepath-input'
) as HTMLInputElement;
const branchRefInput = document.getElementById(
  'branchref-input'
) as HTMLInputElement;

document.getElementById('send-style-changes').onsubmit = e => {
  e.preventDefault();
  // update user info
  state.userName = nameInput.value;
  state.userEmail = emailInput.value;
  state.repository = repositoryInput.value;
  state.colorsFilepath = colorsFilepathInput.value;
  state.branchRef = branchRefInput.value;
  parent.postMessage(
    {
      pluginMessage: {
        type: 'SAVE_USER_INFO',
        userName: state.userName,
        userEmail: state.userEmail,
        repository: state.repository,
        colorsFilepath: state.colorsFilepath,
        branchRef: state.branchRef
      }
    },
    '*'
  );
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

  document.getElementById('confirmation-panel').style.display = 'none';
  document.getElementById('loader-panel').style.display = 'block';
  const PRLink = await updateRemoteColors(state.newColors, {
    token,
    sha: state.encodedColorsFile.sha,
    userName: state.userName,
    userEmail: state.userEmail,
    repository: state.repository,
    colorsFilepath: state.colorsFilepath,
    branchRef: state.branchRef
  });

  document.getElementById('loader-panel').style.display = 'none';
  document.getElementById('success-panel').style.display = 'block';
  const txtArea = document.getElementById(
    'pull-request-input'
  ) as HTMLTextAreaElement;
  txtArea.value = PRLink;
  document.getElementById('pull-request-link').setAttribute('href', PRLink);
  document.getElementById('pull-request-link').textContent = PRLink;
};

const goBackToStep1 = () => {
  document.getElementById('send-style-changes').style.display = 'block';
  document.getElementById('review-panel').innerHTML = '';
  document.getElementById('confirmation-panel').style.display = 'none';
  document.getElementById('success-panel').style.display = 'none';
};
document.getElementById('back-step-1').onclick = async e => {
  e.preventDefault();
  goBackToStep1();
};
document.getElementById('back-step-1-bis').onclick = async e => {
  e.preventDefault();
  goBackToStep1();
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
      if (pluginMessage.repository) {
        state.repository = pluginMessage.repository;
        repositoryInput.value = state.repository;
      }
      if (pluginMessage.colorsFilepath) {
        state.colorsFilepath = pluginMessage.colorsFilepath;
        colorsFilepathInput.value = state.colorsFilepath;
      }
      if (pluginMessage.branchRef) {
        state.branchRef = pluginMessage.branchRef;
        colorsFilepathInput.value = state.branchRef;
      }
      break;
    case 'NEW_COLORS':
      state.newColors = pluginMessage.newColors;
      const { oldColors, encodedColorsFile } = await getOldColors(
        state.repository,
        state.colorsFilepath,
        state.branchRef
      );
      state.encodedColorsFile = encodedColorsFile;

      const colorDiff = detailedDiff(oldColors, state.newColors);
      if (isColorChange(colorDiff)) {
        document.getElementById('send-style-changes').style.display = 'none';
        displayReviewPanel(colorDiff, oldColors);
      }
      break;
  }
};
