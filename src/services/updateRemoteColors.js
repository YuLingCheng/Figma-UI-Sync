var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { makeApiCall } from "./fetch";
const generateBranchName = () => `refs/heads/update-color-${Math.random()
    .toString(36)
    .substr(2, 16)}`;
const getLastCommitSha = (token) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield makeApiCall(`git/matching-refs/heads/master`, {
        token
    });
    return response[0].object.sha;
});
const createBranch = (branchName, token) => __awaiter(void 0, void 0, void 0, function* () {
    const sha = yield getLastCommitSha(token);
    return makeApiCall(`git/refs`, {
        method: "POST",
        token,
        body: {
            ref: branchName,
            sha
        }
    });
});
const updateColorsJsonContent = (sha, newContent, branch, token, userName, userEmail) => makeApiCall(`contents/src/globals/colors.json`, {
    method: "PUT",
    token,
    body: {
        message: "feat(sync): applying Figma colors update",
        content: window.btoa(JSON.stringify(newContent, null, 2)),
        branch,
        committer: {
            name: userName,
            email: userEmail
        },
        sha
    }
});
const createPullRequest = (branchName, token, username, email) => makeApiCall(`pulls`, {
    method: "POST",
    token,
    body: {
        title: "Updating new colors from Figma design",
        head: branchName,
        base: "master",
        body: `Applying colors changes made on Figma by ${username} \n [contact: ${email}]`
    }
});
const updateRemoteColors = (newContent, { token, sha, userName, userEmail }) => __awaiter(void 0, void 0, void 0, function* () {
    const newBranchName = generateBranchName();
    yield createBranch(newBranchName, token);
    yield updateColorsJsonContent(sha, newContent, newBranchName, token, userName, userEmail);
    const { html_url } = yield createPullRequest(newBranchName, token, userName, userEmail);
    return html_url;
});
export default updateRemoteColors;
