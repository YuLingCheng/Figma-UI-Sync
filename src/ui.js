var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
    userEmail: ''
};
const nameInput = document.getElementById('name-input');
const emailInput = document.getElementById('email-input');
document.getElementById('send-style-changes').onsubmit = e => {
    e.preventDefault();
    // update user info
    const newUserName = nameInput.value;
    const newUserEmail = emailInput.value;
    if (newUserName !== state.userName || newUserEmail !== state.userEmail) {
        state.userName = newUserName;
        state.userEmail = newUserEmail;
        parent.postMessage({
            pluginMessage: {
                type: 'SAVE_USER_INFO',
                newUserName,
                newUserEmail
            }
        }, '*');
    }
    // get new colors
    parent.postMessage({ pluginMessage: { type: 'GET_NEW_COLORS' } }, '*');
};
document.getElementById('validate').onclick = (e) => __awaiter(void 0, void 0, void 0, function* () {
    e.preventDefault();
    console.log('New Colors to send to repo', state.newColors);
    const tokenInput = document.getElementById('token');
    const token = tokenInput.value;
    yield updateRemoteColors(state.newColors, {
        token,
        sha: state.encodedColorsFile.sha,
        userName: state.userName,
        userEmail: state.userEmail
    });
});
onmessage = (event) => __awaiter(void 0, void 0, void 0, function* () {
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
            const { oldColors, encodedColorsFile } = yield getOldColors();
            state.encodedColorsFile = encodedColorsFile;
            const colorDiff = detailedDiff(oldColors, state.newColors);
            if (isColorChange(colorDiff)) {
                document.getElementById('send-style-changes').style.display = 'none';
                displayReviewPanel(colorDiff, oldColors);
            }
            break;
    }
});
