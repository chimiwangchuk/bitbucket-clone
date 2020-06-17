import React from 'react';
import { connect } from 'react-redux';
import { colors } from '@atlaskit/theme';
import InfoIcon from '@atlaskit/icon/glyph/info';
import { FormattedMessage, injectIntl, InjectedIntl } from 'react-intl';
import Flag from '@atlaskit/flag';
import { ComponentFlagId } from 'src/redux/flags/types';
import { showNewCommits } from 'src/redux/commit-list';
import { startApdex } from 'src/utils/analytics/apdex';
import { ApdexTask } from 'src/types/apdex';

import i18n from './i18n';

type Props = {
  id: ComponentFlagId;
  showNewCommits: typeof showNewCommits;
  intl: InjectedIntl;
};

export class UpdatedCommitsListFlag extends React.PureComponent<Props> {
  showNewCommits = () => {
    startApdex({
      task: ApdexTask.Commits,
      type: 'transition',
    });

    this.props.showNewCommits();
  };

  render() {
    const actions = [
      {
        content: <FormattedMessage {...i18n.showUpdatedCommits} />,
        onClick: this.showNewCommits,
      },
    ];

    return (
      <Flag
        actions={actions}
        icon={<InfoIcon primaryColor={colors.B400} label="Info" />}
        title={<FormattedMessage {...i18n.title} />}
        {...this.props}
      />
    );
  }
}

const mapDispatchToProps = {
  showNewCommits,
};

export default connect(
  null,
  mapDispatchToProps
)(injectIntl(UpdatedCommitsListFlag));
