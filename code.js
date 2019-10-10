// This plugin will open a modal to prompt the user to enter a number, and
// it will then create that many rectangles on the screen.
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// This file holds the main code for the plugins. It has access to the *document*.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser enviroment (see documentation).
// This shows the HTML page in "ui.html".
figma.showUI(__html__);
// get designer's name
const getDesignersName = () => __awaiter(this, void 0, void 0, function* () {
    const name = yield figma.clientStorage.getAsync("UX_NAME");
    figma.ui.postMessage({
        type: "GET_STORED_UX_NAME",
        name
    });
});
getDesignersName();
// ------ Parse paintstyles -------
const painStyles = figma.getLocalPaintStyles();
const parseColorName = (color) => {
    const [name, variant] = color.name.split(" / ");
    return {
        name: name.toLowerCase(),
        variant: parseInt(variant)
    };
};
const parseRGBToHex = (color) => {
    const r = Math.floor(color.r * 255);
    const g = Math.floor(color.g * 255);
    const b = Math.floor(color.b * 255);
    return `#${r.toString(16)}${g.toString(16)}${b.toString(16)}`;
};
const solidPaintStyles = painStyles.filter(paintStyle => paintStyle.paints[0].type === "SOLID");
const reducedColors = {};
solidPaintStyles.reduce((reducedColors, solidPainstyle) => {
    const { name, variant } = parseColorName(solidPainstyle);
    if (!reducedColors[name]) {
        reducedColors[name] = {};
    }
    const paint = solidPainstyle.paints[0];
    reducedColors[name][variant] = parseRGBToHex(paint.color);
    return reducedColors;
}, reducedColors);
// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
figma.ui.onmessage = msg => {
    // One way of distinguishing between different types of messages sent from
    // your HTML page is to use an object with a "type" property like this.
    console.log(msg);
    if (msg.type === "SAVE_UX_NAME") {
        const { uxName } = msg;
        figma.clientStorage.setAsync("UX_NAME", uxName);
    }
};
