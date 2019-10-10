const updateRemoteColors = (token, sha, newContent, userName, userEmail) =>
  fetch(
    'https://api.github.com/repos/Dashlane/ui-components/contents/src/globals/colors.json',
    {
      method: 'PUT',
      headers: {
        Authorization: `token ${token}`
      },
      body: JSON.stringify({
        message: 'feat(sync): testing update',
        content: window.btoa(JSON.stringify(newContent, null, 2)),
        branch: 'sync-colors',
        committer: {
          name: userName,
          email: userEmail
        },
        sha
      })
    }
  );

export default updateRemoteColors;
