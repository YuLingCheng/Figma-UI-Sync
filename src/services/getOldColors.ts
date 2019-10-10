const getOldColors = async () => {
  const colorsFileResponse = await fetch(
    'https://api.github.com/repos/Dashlane/ui-components/contents/src/globals/colors.json?ref=sync-colors'
  );

  const encodedColorsFile = await colorsFileResponse.json();
  const decodedColorsFile = window.atob(encodedColorsFile.content);
  const oldColors = JSON.parse(decodedColorsFile);

  return { oldColors, encodedColorsFile };
};

export default getOldColors;
