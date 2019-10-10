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
const generateBranchName = () => `refs/heads/update-color-${Math.random().toString(36).substr(2, 16)}`;
const getLastCommitSha = (token) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield makeApiCall(`git/matching-refs/heads/master`, {
        headers: {
            Authorization: `token ${token}`
        }
    });
    console.log(response);
    return response;
});
const createBranch = (branchName, sha, token) => makeApiCall(`git/refs`, {
    method: 'POST',
    headers: {
        Authorization: `token ${token}`
    },
    body: JSON.stringify({
        ref: branchName,
        sha
    })
});
const updateColorsJsonContent = (sha, newContent, branch) => makeApiCall(`contents/src/globals/colors.json`, {
    method: 'PUT',
    headers: {
        Authorization: 'token ff4f9c6b0ca810c1c88f51274ec7fffae36da7d7'
    },
    body: JSON.stringify({
        message: 'feat(sync): applying Figma colors update',
        content: window.btoa(JSON.stringify(newContent, null, 2)),
        branch,
        sha
    })
});
const createPullRequest = branchName => fetch(`pulls`, {
    method: 'POST',
    headers: {
        Authorization: 'token ff4f9c6b0ca810c1c88f51274ec7fffae36da7d7'
    },
    body: JSON.stringify({
        title: 'Updating new colors from Figma design',
        head: branchName,
        base: 'master',
        body: 'Testing Pull Request creation feature'
    })
});
const updateRemoteColors = (newContent, { token, sha, userName, userEmail }) => __awaiter(void 0, void 0, void 0, function* () {
    yield getLastCommitSha(token);
    // const newBranchName = generateBranchName();
    // await createBranch()
    // await updateColorsJsonContent(sha, newContent, b)
});
export default updateRemoteColors;
