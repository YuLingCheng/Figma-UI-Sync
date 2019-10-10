import { makeApiCall } from './fetch';

const getOldColors = async () => {
  const encodedColorsFile = await makeApiCall(
    'contents/src/globals/colors.json?ref=sync-colors'
  );

  const decodedColorsFile = window.atob(encodedColorsFile.content);
  const oldColors = JSON.parse(decodedColorsFile);

  return { oldColors, encodedColorsFile };
};

export default getOldColors;
