import React, { useEffect } from 'react';
import { injectIntl, InjectedIntl } from 'react-intl';
import Flag from '@atlaskit/flag';
import SuccessIcon from '@atlaskit/icon/glyph/check-circle';
import { colors } from '@atlaskit/theme';
import { ComponentFlagId, ComponentFlagProps } from 'src/redux/flags/types';

import messages from './online.i18n';

type Props = ComponentFlagProps & {
  id: ComponentFlagId;
  intl: InjectedIntl;
};

const OnlineFlag = ({ id, intl, ...otherProps }: Props) => {
  useEffect(() => {
    const dismissFlag = setTimeout(() => {
      if (otherProps.onDismissed) {
        otherProps.onDismissed(id);
      }
    }, 2000);

    return () => {
      clearTimeout(dismissFlag);
    };
  }, [otherProps.onDismissed]);

  return (
    <Flag
      {...otherProps}
      id={id}
      appearance="success"
      icon={<SuccessIcon label="success" secondaryColor={colors.G300} />}
      title={intl.formatMessage(messages.onlineTitle)}
    />
  );
};

export default injectIntl(OnlineFlag);
