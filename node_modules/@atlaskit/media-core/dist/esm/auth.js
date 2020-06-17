export function isClientBasedAuth(auth) {
    return !!auth.clientId;
}
export function isAsapBasedAuth(auth) {
    return !!auth.asapIssuer;
}
export var authToOwner = function (auth) {
    if (isAsapBasedAuth(auth)) {
        return auth;
    }
    var clientAuth = {
        id: auth.clientId,
        baseUrl: auth.baseUrl,
        token: auth.token,
    };
    return clientAuth;
};
//# sourceMappingURL=auth.js.map