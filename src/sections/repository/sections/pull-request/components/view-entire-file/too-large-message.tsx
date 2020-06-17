import React from 'react';
import { FormattedMessage } from 'react-intl';
import { useSelector } from 'react-redux';

import { CopyButton } from 'src/components/copy';
import { useIntl } from 'src/hooks/intl';
import {
  getPullRequestSourceHash,
  getPullRequestDestinationHash,
} from 'src/redux/pull-request/selectors';
import { getCurrentRepositoryScm } from 'src/selectors/repository-selectors';
import { CodeBlock } from 'src/styles';
import urls from 'src/urls';
import { shortHash } from 'src/utils/short-hash';
import {
  formatScm,
  scmCommandCode,
} from 'src/sections/repository/utils/formatted-scm';

import messages from './i18n';
import { ScmCommandCodeContainer } from './styled';

type Props = {
  path: string | null;
};

export const TooLargeMessage = React.memo((props: Props) => {
  const intl = useIntl();
  const scm = useSelector(getCurrentRepositoryScm);
  const featureBranchHash = useSelector(getPullRequestSourceHash);
  const targetBranchHash = useSelector(getPullRequestDestinationHash);

  if (!featureBranchHash || !targetBranchHash) {
    return null;
  }

  // In practical usage, a `path` prop will always be present (because it's
  // required in order to open the modal where this message is used). Because
  // it's technically optional in the redux store (whenever the modal is closed /
  // its initial state), we provide a fallback
  const path = props.path || '/path/to/file';

  const featureBranchShortHash = shortHash(featureBranchHash);
  const targetBranchShortHash = shortHash(targetBranchHash);

  const commandCode = scmCommandCode(
    scm,
    targetBranchShortHash,
    featureBranchShortHash,
    path
  );

  return (
    <>
      <FormattedMessage
        {...messages.tooLargeMessage}
        tagName="p"
        values={{ scm: formatScm(scm) }}
      />
      <ScmCommandCodeContainer>
        <CodeBlock>{commandCode}</CodeBlock>
        <CopyButton value={commandCode} />
      </ScmCommandCodeContainer>
      <p>
        <a
          href={urls.external.fileRenderingLimitDocs}
          rel="noopener"
          target="_blank"
        >
          {intl.formatMessage(messages.learnMoreLink)}
        </a>
      </p>
    </>
  );
});
