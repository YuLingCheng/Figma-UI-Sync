// This plugin will open a modal to prompt the user to enter a number, and
// it will then create that many rectangles on the screen.

// This file holds the main code for the plugins. It has access to the *document*.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser enviroment (see documentation).

// This shows the HTML page in "ui.html".
figma.showUI(__html__);

// ------ Parse paintstyles -------
const painStyles = figma.getLocalPaintStyles();

const parseColorName = (
  color: PaintStyle
): { name: string; variant: number } => {
  const [name, variant] = color.name.split(" / ");
  return {
    name: name.toLowerCase(),
    variant: parseInt(variant)
  };
};

const parseRGBToHex = (color: RGB): string => {
  const r = Math.floor(color.r * 255);
  const g = Math.floor(color.g * 255);
  const b = Math.floor(color.b * 255);
  return `#${r.toString(16)}${g.toString(16)}${b.toString(16)}`;
};

const solidPaintStyles = painStyles.filter(
  paintStyle => paintStyle.paints[0].type === "SOLID"
);

interface ParsedColors {
  [colorName: string]: {
    [colorVariant: number]: string;
  };
}

const reducedColors = {};
solidPaintStyles.reduce((reducedColors: ParsedColors, solidPainstyle) => {
  const { name, variant } = parseColorName(solidPainstyle);
  if (!reducedColors[name]) {
    reducedColors[name] = {};
  }

  const paint = solidPainstyle.paints[0] as SolidPaint;
  reducedColors[name][variant] = parseRGBToHex(paint.color);
  return reducedColors;
}, reducedColors);

console.log(reducedColors);

// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
figma.ui.onmessage = msg => {
  // One way of distinguishing between different types of messages sent from
  // your HTML page is to use an object with a "type" property like this.
  if (msg.type === "push-changes") {
    const { token } = msg;
  }
};
