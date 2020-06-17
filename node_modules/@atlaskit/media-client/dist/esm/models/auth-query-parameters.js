import { isClientBasedAuth } from '@atlaskit/media-core';
export function mapAuthToQueryParameters(auth) {
    if (isClientBasedAuth(auth)) {
        return {
            client: auth.clientId,
            token: auth.token,
        };
    }
    else {
        return {
            issuer: auth.asapIssuer,
            token: auth.token,
        };
    }
}
//# sourceMappingURL=auth-query-parameters.js.map