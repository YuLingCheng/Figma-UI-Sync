var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import getNewColors from './services/getNewColors';
// This plugin will open a modal to prompt the user to enter a number, and
// it will then create that many rectangles on the screen.
// This file holds the main code for the plugins. It has access to the *document*.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser enviroment (see documentation).
// This shows the HTML page in "ui.html".
figma.showUI(__html__, { width: 800, height: 700 });
// get user's info
const getUserInfo = () => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email } = yield figma.clientStorage.getAsync('USER_INFO');
    figma.ui.postMessage({
        type: 'GET_STORED_USER_INFO',
        name,
        email
    });
});
getUserInfo();
// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
figma.ui.onmessage = msg => {
    // One way of distinguishing between different types of messages sent from
    // your HTML page is to use an object with a "type" property like this.
    if (msg.type === 'SAVE_USER_INFO') {
        const { newUserName, newUserEmail } = msg;
        figma.clientStorage.setAsync('USER_INFO', {
            name: newUserName,
            email: newUserEmail
        });
        return;
    }
    if (msg.type === 'GET_NEW_COLORS') {
        const newColors = getNewColors(figma);
        figma.ui.postMessage({ type: 'NEW_COLORS', newColors });
    }
};
