export default function getColorMessage(messages, color) {
    var message = messages[color];
    if (!message) {
        // eslint-disable-next-line no-console
        console.warn("Text color palette does not have an internationalization message for color " + color.toUpperCase() + ".\nYou must add a message description to properly translate this color.\nUsing current label as default message.\nThis could have happen when someone changed the 'colorPalette' from 'adf-schema' without updating this file.\n");
    }
    return message;
}
//# sourceMappingURL=getColorMessage.js.map