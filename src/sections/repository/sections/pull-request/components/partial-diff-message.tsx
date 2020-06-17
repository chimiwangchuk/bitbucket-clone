import SectionMessage from '@atlaskit/section-message';
import React from 'react';
import {
  defineMessages,
  FormattedMessage,
  injectIntl,
  InjectedIntl,
} from 'react-intl';

import { CopyButton } from 'src/components/copy';
import { CodeBlock, CodeContainer } from 'src/styles';
import urls from 'src/urls';
import { shortHash } from 'src/utils/short-hash';
import {
  formatScm,
  scmCommandCode,
} from 'src/sections/repository/utils/formatted-scm';

const messages = defineMessages({
  body: {
    id: 'frontbucket.repository.pullRequest.partialDiffMessage.body',
    description:
      'Content of the message displayed above a pull request that is larger than our rendering limits allow for',
    defaultMessage: `This pull request is too large for Bitbucket to display. You can view the full diff using the following command in your local {scm} client:`,
  },
  learnMoreLink: {
    id: 'frontbucket.repository.pullRequest.partialDiffMessage.learnMoreLink',
    description:
      'Text for a link to documentation about rendering limits for large diffs',
    defaultMessage: 'Learn more',
  },
  title: {
    id: 'frontbucket.repository.pullRequest.partialDiffMessage.title',
    description:
      'Title of the message displayed above a pull request that is larger than our rendering limits allow for',
    defaultMessage: `Pull request is too large to display`,
  },
});

type PartialDiffMessageProps = {
  featureBranchHash?: string;
  intl: InjectedIntl;
  scm: 'git' | 'hg';
  targetBranchHash?: string;
};

const PartialDiffMessage = (props: PartialDiffMessageProps) => {
  const { featureBranchHash, intl, scm, targetBranchHash } = props;

  if (!featureBranchHash || !targetBranchHash) {
    return null;
  }

  const actions = [
    {
      key: 'learn-more-link',
      text: (
        <a
          href={urls.external.fileRenderingLimitDocs}
          rel="noopener"
          target="_blank"
        >
          {intl.formatMessage(messages.learnMoreLink)}
        </a>
      ),
    },
  ];

  const featureBranchShortHash = shortHash(featureBranchHash);
  const targetBranchShortHash = shortHash(targetBranchHash);

  const commandCode = scmCommandCode(
    scm,
    targetBranchShortHash,
    featureBranchShortHash
  );

  return (
    <SectionMessage
      actions={actions}
      appearance="info"
      title={intl.formatMessage(messages.title)}
    >
      <FormattedMessage
        {...messages.body}
        tagName="p"
        values={{ scm: formatScm(scm) }}
      />
      <CodeContainer>
        <CodeBlock>{commandCode}</CodeBlock>
        <CopyButton value={commandCode} />
      </CodeContainer>
    </SectionMessage>
  );
};

export default injectIntl(PartialDiffMessage);
