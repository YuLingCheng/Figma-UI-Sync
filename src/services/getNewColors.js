// ------ Parse paintstyles -------
const getNewColors = (figma) => {
    const painStyles = figma.getLocalPaintStyles();
    const parseColorName = (color) => {
        const [name, variant] = color.name.split(' / ');
        return {
            name: name.toLowerCase(),
            variant: parseInt(variant)
        };
    };
    const stringyfyRGB = (color) => {
        const r = Math.floor(color.r * 255);
        const g = Math.floor(color.g * 255);
        const b = Math.floor(color.b * 255);
        return `rgb(${r},${g},${b})`;
    };
    const solidPaintStyles = painStyles.filter(paintStyle => paintStyle.paints[0].type === 'SOLID');
    const reducedColors = {};
    solidPaintStyles.reduce((reducedColors, solidPainstyle) => {
        const { name, variant } = parseColorName(solidPainstyle);
        if (!reducedColors[name]) {
            reducedColors[name] = {};
        }
        const paint = solidPainstyle.paints[0];
        reducedColors[name][variant] = stringyfyRGB(paint.color);
        return reducedColors;
    }, reducedColors);
    return reducedColors;
};
export default getNewColors;
