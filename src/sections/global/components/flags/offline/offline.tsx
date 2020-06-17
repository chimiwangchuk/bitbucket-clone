import React from 'react';
import { injectIntl, InjectedIntl } from 'react-intl';
import Flag from '@atlaskit/flag';
import ErrorIcon from '@atlaskit/icon/glyph/error';
import { colors } from '@atlaskit/theme';
import { ComponentFlagId } from 'src/redux/flags/types';
import messages from './offline.i18n';

type Props = {
  id: ComponentFlagId;
  intl: InjectedIntl;
};

const OfflineFlag = ({ id, intl, ...otherProps }: Props) => (
  <Flag
    {...otherProps}
    id={id}
    appearance="error"
    icon={<ErrorIcon label="error" secondaryColor={colors.R300} />}
    title={intl.formatMessage(messages.offlineTitle)}
    description={intl.formatMessage(messages.offlineDescription)}
  />
);

export default injectIntl(OfflineFlag);
