import React, { PureComponent, ReactNode } from 'react';
import { connect } from 'react-redux';

import { SpotlightCard } from '@atlaskit/onboarding';
import CrossIcon from '@atlaskit/icon/glyph/cross';
import Button, { ButtonGroup } from '@atlaskit/button';

import { Dispatch } from 'src/types/state';
import { publishFact } from 'src/utils/analytics/publish';

import { FlagViewed, FlagActionClicked } from '../../../facts';
import * as styles from './flag.style';
import { Action } from './types';

type CelebrationFlagProps = {
  id: string;
  isDismissAllowed: boolean;
  onDismissed: (id: string) => void;
  title: string;
  description: ReactNode;
  actions: Action[];
  dispatch: Dispatch;
};

export class BaseCelebrationFlag extends PureComponent<CelebrationFlagProps> {
  static defaultProps = {
    isDismissAllowed: false,
    onDismissed: () => {},
    actions: [],
    dispatchAction: () => {},
  };

  componentDidMount() {
    const { id } = this.props;
    publishFact(new FlagViewed({ flag_id: id }));
  }

  renderAction = (action: Action) => {
    const { dispatch, id, onDismissed } = this.props;
    const { analyticsId } = action;
    const btnProps: React.ComponentProps<typeof Button> = {};

    if (action.type === 'dispatch') {
      const { reduxActionType: type, reduxActionPayload: payload } = action;
      btnProps.onClick = () => {
        publishFact(
          new FlagActionClicked({ flag_id: id, action_id: analyticsId })
        );
        dispatch({ type, payload });
        onDismissed(id);
      };
    } else if (action.type === 'link') {
      btnProps.href = action.href;
      btnProps.onClick = () => {
        publishFact(
          new FlagActionClicked({ flag_id: id, action_id: analyticsId })
        );
      };
    } else {
      return null;
    }

    return (
      <styles.ActionItem key={analyticsId}>
        <Button appearance={action.appearance || 'default'} {...btnProps}>
          {action.content}
        </Button>
      </styles.ActionItem>
    );
  };

  render() {
    const {
      id,
      title,
      description,
      actions,
      isDismissAllowed,
      onDismissed,
    } = this.props;

    return (
      <SpotlightCard>
        <styles.HeadingWrapper>
          <h5>{title}</h5>
          {isDismissAllowed && (
            <Button onClick={() => onDismissed(id)} appearance="subtle-link">
              <CrossIcon size="small" label="" />
            </Button>
          )}
        </styles.HeadingWrapper>
        <styles.Description>{description}</styles.Description>
        <styles.Actions>
          <styles.ActionItems>
            <ButtonGroup>{actions.map(this.renderAction)}</ButtonGroup>
          </styles.ActionItems>
        </styles.Actions>
      </SpotlightCard>
    );
  }
}

export default connect()(BaseCelebrationFlag);
