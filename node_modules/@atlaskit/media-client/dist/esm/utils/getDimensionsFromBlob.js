export var getDimensionsFromBlob = function (blob) {
    return new Promise(function (resolve, reject) {
        var imageSrc = URL.createObjectURL(blob);
        var img = new Image();
        img.src = imageSrc;
        img.onload = function () {
            var dimensions = { width: img.width, height: img.height };
            URL.revokeObjectURL(imageSrc);
            resolve(dimensions);
        };
        img.onerror = reject;
    });
};
//# sourceMappingURL=getDimensionsFromBlob.js.map