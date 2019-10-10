import { makeApiCall } from './fetch';

const getOldColors = async (repository, colorsFilepath, branchRef) => {
  const encodedColorsFile = await makeApiCall(
    `contents/${colorsFilepath}?ref=${branchRef}`,
    repository
  );

  const decodedColorsFile = window.atob(encodedColorsFile.content);
  const oldColors = JSON.parse(decodedColorsFile);

  return { oldColors, encodedColorsFile };
};

export default getOldColors;
