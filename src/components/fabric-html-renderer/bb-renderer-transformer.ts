import { BitbucketTransformer } from '@atlaskit/editor-bitbucket-transformer';
import { bitbucketSchema } from '@atlaskit/adf-schema';

const htmlTransformer = new BitbucketTransformer(bitbucketSchema, {
  disableBitbucketLinkStripping: true,
});

export { htmlTransformer };
