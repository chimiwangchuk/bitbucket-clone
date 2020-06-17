import Flag, { AutoDismissFlag } from '@atlaskit/flag';
import React, { PureComponent } from 'react';
import { injectIntl, InjectedIntl } from 'react-intl';
import Info from '@atlaskit/icon/glyph/info';
import CheckCircleIcon from '@atlaskit/icon/glyph/check-circle';
import Warning from '@atlaskit/icon/glyph/warning';
import Error from '@atlaskit/icon/glyph/error';
import { colors } from '@atlaskit/theme';

import { FlagText, SimpleFlagProps } from 'src/redux/flags/types';
import { publishFact } from 'src/utils/analytics/publish';

import { FlagViewed } from '../../../facts';
import * as styles from './simple-flag.style';

export enum AppearanceTypes {
  error = 'error',
  info = 'info',
  normal = 'normal',
  success = 'success',
  warning = 'warning',
}

const icons: { [K in AppearanceTypes]: React.ReactElement } = {
  error: <Error label="Error" primaryColor={colors.R300} />,
  info: <Info label="Info" primaryColor={colors.P300} />,
  normal: <Info label="Info" primaryColor={colors.P300} />,
  success: <CheckCircleIcon label="Success" primaryColor={colors.G300} />,
  warning: <Warning label="Warning" primaryColor={colors.Y300} />,
};

type FlagProps = SimpleFlagProps & {
  intl: InjectedIntl;
};

class SimpleFlag extends PureComponent<FlagProps> {
  componentDidMount() {
    publishFact(new FlagViewed({ flag_id: this.props.id }));
  }

  extractIntlMessage = (text: FlagText) =>
    typeof text === 'string'
      ? text
      : this.props.intl.formatMessage(text.msg, text.values);

  render() {
    const {
      actions,
      autoDismiss,
      description,
      iconType,
      id,
      title,
      // FlagGroup passes other props through to its Children that need to be preserved
      ...akProps
    } = this.props;

    const intlActions = actions
      ? actions.map(action => ({
          content: this.extractIntlMessage(action.content),
          onClick: () => {
            window.location.assign(action.href);
          },
        }))
      : undefined;

    const intlTitle = this.extractIntlMessage(this.props.title);
    const intlDescription = description
      ? this.extractIntlMessage(description)
      : undefined;

    const flagProps: React.ComponentProps<typeof Flag> = {
      ...akProps,
      actions: intlActions,
      appearance: 'normal',
      description: (
        <styles.SimpleFlagDescription>
          {intlDescription}
        </styles.SimpleFlagDescription>
      ),
      icon: iconType ? icons[iconType] : icons.normal,
      id,
      title: intlTitle,
    };

    return autoDismiss ? (
      <AutoDismissFlag key={id} {...flagProps} />
    ) : (
      <Flag key={id} {...flagProps} />
    );
  }
}

export default injectIntl(SimpleFlag);
