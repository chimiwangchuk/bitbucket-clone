import React from 'react';
import { FormattedMessage } from 'react-intl';
import qs from 'qs';
import { AutoDismissFlag } from '@atlaskit/flag';
import { colors } from '@atlaskit/theme';
import CheckCircleIcon from '@atlaskit/icon/glyph/check-circle';
import { ComponentFlagId } from 'src/redux/flags/types';
import { useIntl } from 'src/hooks/intl';

import messages from './delete-repository.i18n';

type Props = {
  id: ComponentFlagId;
  description: string;
};

const DeleteRepositorySuccessFlag = ({
  id,
  description,
  ...otherProps
}: Props) => {
  const intl = useIntl();
  const query = qs.parse(window.location.search, {
    ignoreQueryPrefix: true,
  });

  return (
    <AutoDismissFlag
      {...otherProps}
      id={id}
      description={
        query.repo_name ? (
          <FormattedMessage
            {...messages.deleteMessageDescription}
            values={{ repoName: <strong>{query.repo_name}</strong> }}
          />
        ) : (
          <FormattedMessage {...messages.deleteUnknownRepoDescription} />
        )
      }
      icon={<CheckCircleIcon label="Success" primaryColor={colors.G300} />}
      title={intl.formatMessage(messages.deleteMessageSuccessTitle)}
    />
  );
};

export default DeleteRepositorySuccessFlag;
