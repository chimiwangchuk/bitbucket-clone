import { JSONTransformer } from '@atlaskit/editor-json-transformer';

const jsonTransformer = new JSONTransformer();
// @ts-ignore TODO: fix noImplicitAny error here
const toJson = parsedHtml => jsonTransformer.encode(parsedHtml);

export { toJson };
