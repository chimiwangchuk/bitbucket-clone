import IssueIcon from '@atlaskit/icon/glyph/issue';
import { colors } from '@atlaskit/theme';
import { ResultBase } from '@atlaskit/quick-search';
import React, { PureComponent } from 'react';

import * as styles from './icon.style';

type Issue = {
  id: string;
  repository: string;
  title: string;
};

type IssueResultProps = {
  issue: Issue;
};

export default class IssueResult extends PureComponent<IssueResultProps> {
  render() {
    const { issue, ...props } = this.props;

    const text = `#${issue.id}: ${issue.title}`;

    const icon = (
      <styles.Icon backgroundColor={colors.N30}>
        <IssueIcon label={text} />
      </styles.Icon>
    );

    return (
      <ResultBase
        type="base"
        icon={icon}
        text={text}
        resultId={issue.id}
        subText={issue.repository}
        {...props}
      />
    );
  }
}
