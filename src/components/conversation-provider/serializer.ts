import { BitbucketTransformer } from '@atlaskit/editor-bitbucket-transformer';
import { bitbucketSchema as schema } from '@atlaskit/adf-schema';
import { JSONTransformer } from '@atlaskit/editor-json-transformer';

const jsonTransformer = new JSONTransformer();

const serializer = new BitbucketTransformer(schema, {
  disableBitbucketLinkStripping: true,
});

export const encode = (doc: any) => serializer.encode(schema.nodeFromJSON(doc));

export const parse = (html: string) =>
  jsonTransformer.encode(serializer.parse(html));
