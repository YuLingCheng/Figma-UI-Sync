var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { detailedDiff } from "deep-object-diff";
import getOldColors from "./services/getOldColors";
import isColorChange from "./services/isColorChange";
import "./ui.css";
import displayReviewPanel from "./views/review";
import updateRemoteColors from "./services/updateRemoteColors";
const state = {
    newColors: {},
    encodedColorsFile: {
        sha: ""
    },
    userName: "",
    userEmail: "",
    commitSha: "b1b2ec91017645a628f488c8b79d611e2173276f"
};
const nameInput = document.getElementById("name-input");
const emailInput = document.getElementById("email-input");
document.getElementById("send-style-changes").onsubmit = e => {
    e.preventDefault();
    // update user info
    const newUserName = nameInput.value;
    const newUserEmail = emailInput.value;
    if (newUserName !== state.userName || newUserEmail !== state.userEmail) {
        state.userName = newUserName;
        state.userEmail = newUserEmail;
        parent.postMessage({
            pluginMessage: {
                type: "SAVE_USER_INFO",
                newUserName,
                newUserEmail
            }
        }, "*");
    }
    // get new colors
    parent.postMessage({ pluginMessage: { type: "GET_NEW_COLORS" } }, "*");
};
document.getElementById("validate").onclick = (e) => __awaiter(void 0, void 0, void 0, function* () {
    e.preventDefault();
    //send colors to Repo
    console.log("New Colors to send to repo", state.newColors);
    const tokenInput = document.getElementById("token");
    const token = tokenInput.value;
    const PRLink = yield updateRemoteColors(state.newColors, {
        token,
        sha: state.encodedColorsFile.sha,
        userName: state.userName,
        userEmail: state.userEmail
    });
    document.getElementById("confirmation-panel").style.display = "none";
    document.getElementById("success-panel").style.display = "block";
    const txtArea = document.getElementById("pull-request-input");
    txtArea.value = PRLink;
    document.getElementById("pull-request-link").setAttribute("href", PRLink);
    document.getElementById("pull-request-link").textContent = PRLink;
});
document.getElementById("back-step-1").onclick = (e) => __awaiter(void 0, void 0, void 0, function* () {
    e.preventDefault();
    document.getElementById("send-style-changes").style.display = "block";
    document.getElementById("review-panel").innerHTML = "";
    document.getElementById("confirmation-panel").style.display = "none";
});
document.getElementById("copy-url-button").addEventListener("click", e => {
    /* Get the text field */
    var copyText = document.getElementById("pull-request-input");
    /* Select the text field */
    copyText.select();
    /* Copy the text inside the text field */
    document.execCommand("copy");
    /* Alert the copied text */
    document.getElementById("url-copied").style.display = "block";
});
onmessage = (event) => __awaiter(void 0, void 0, void 0, function* () {
    const { pluginMessage } = event.data;
    switch (pluginMessage.type) {
        case "GET_STORED_USER_INFO":
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
        case "NEW_COLORS":
            state.newColors = pluginMessage.newColors;
            const { oldColors, encodedColorsFile } = yield getOldColors();
            state.encodedColorsFile = encodedColorsFile;
            const colorDiff = detailedDiff(oldColors, state.newColors);
            if (isColorChange(colorDiff)) {
                document.getElementById("send-style-changes").style.display = "none";
                displayReviewPanel(colorDiff, oldColors);
            }
            break;
    }
});
