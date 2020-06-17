export function getExtensionRenderer(extensionHandler) {
    if (typeof extensionHandler === 'object') {
        return extensionHandler.render;
    }
    else {
        return extensionHandler;
    }
}
//# sourceMappingURL=extension-handler.js.map