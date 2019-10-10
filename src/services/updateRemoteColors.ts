import { makeApiCall } from "./fetch";

const generateBranchName = () => `refs/heads/update-color-${Math.random().toString(36).substr(2, 16)}`;

const getLastCommitSha = async (token) => {
  const response = await makeApiCall(`git/matching-refs/heads/master`, {
    token
  });
  return response[0].object.sha;
};

const createBranch = async (branchName, token) => {
  const sha = await getLastCommitSha(token);

  return makeApiCall(`git/refs`, {
    method: 'POST',
    token,
    body: {
      ref: branchName,
      sha
    }
  });
};

const updateColorsJsonContent = (sha, newContent, branch, token) => makeApiCall(
    `contents/src/globals/colors.json`,
    {
      method: 'PUT',
      token,
      body: {
        message: 'feat(sync): applying Figma colors update',
        content: window.btoa(JSON.stringify(newContent, null, 2)),
        branch,
        sha
      }
    }
  );

const createPullRequest = (branchName, token, username, email) => makeApiCall(`pulls`, {
    method: 'POST',
    token,
    body: {
      title: 'Updating new colors from Figma design',
      head: branchName,
      base: 'master',
      body: `Applying colors changes made on Figma by ${username} \n [contact: ${email}]`
    }
  });


const updateRemoteColors = async (newContent, {token, sha, userName, userEmail}) => {
  const newBranchName = generateBranchName();
  await createBranch(newBranchName, token);
  await updateColorsJsonContent(sha, newContent, newBranchName, token);
  const { html_url } = await createPullRequest(newBranchName, token, userName, userEmail);

  return html_url;
};


export default updateRemoteColors;
