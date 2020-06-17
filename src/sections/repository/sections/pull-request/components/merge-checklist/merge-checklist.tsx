import React, { PureComponent } from 'react';
import { FormattedMessage, injectIntl, InjectedIntl } from 'react-intl';

import BulletListIcon from '@atlaskit/icon/glyph/bullet-list';

import Button from '@atlaskit/button';
import Tooltip from '@atlaskit/tooltip';
import CheckCircleIcon from '@atlaskit/icon/glyph/check-circle';
import { colors } from '@atlaskit/theme';
import { MergeCheck } from 'src/types';
import store from 'src/utils/store';
import { Expander, ExpanderOnChangeEvent } from 'src/components/sidebar';
import { RepositoryPrivilege } from 'src/sections/repository/types';
import GenericMessage from 'src/components/generic-message';
import blankIconUrl from './merge-check-blank.svg';
import MergeChecklistEmptyState from './merge-checklist-empty-state';
import * as styles from './merge-checklist.style';
import messages from './merge-checklist.i18n';
import { sortMergeChecklist } from './utils';

const MERGE_CHECKLIST_COLLAPSED_LOCALSTORAGE_KEY = 'merge.checklist.collapsed';

type MergeChecklistProps = {
  isCollapsed?: boolean;
  intl: InjectedIntl;
  repositoryFullSlug: string;
  userLevel: RepositoryPrivilege | null | undefined;
  mergeCheckItems: MergeCheck[];
  isMergeable: boolean;
  isMergeChecklistLoading: boolean;
  mergeChecksError: string;
  retryFetchMergeChecks: () => void;
};

export const GrayIcon = injectIntl(props => (
  <img
    alt={props.intl.formatMessage(messages.greyIconAltText)}
    src={blankIconUrl}
  />
));

class MergeChecklist extends PureComponent<MergeChecklistProps> {
  onCardStatusChange = (event: ExpanderOnChangeEvent) => {
    store.set(MERGE_CHECKLIST_COLLAPSED_LOCALSTORAGE_KEY, event.isCollapsed);
  };

  initialCardIsCollapsed = () =>
    store.get(MERGE_CHECKLIST_COLLAPSED_LOCALSTORAGE_KEY, false);

  countPassedMergeChecks() {
    return this.props.mergeCheckItems.filter(mergeCheck => mergeCheck.pass)
      .length;
  }

  countFailedMergeChecks() {
    return this.props.mergeCheckItems.filter(mergeCheck => !mergeCheck.pass)
      .length;
  }

  // We only want the expander to be in its loading state during the inital
  // fetching of merge checks. Subsequent fetches (e.g. re-fetch after
  // completing a task) shouldn't trigger the expander loading state,
  // otherwise it will collapse the card while fetching which will
  // cause the other sidebar elements to jump around.
  isLoading = (): boolean =>
    this.props.isMergeChecklistLoading && !this.props.mergeCheckItems.length;

  renderLabels() {
    const { mergeCheckItems, intl } = this.props;

    if (mergeCheckItems.length === 0) {
      const countNoChecks = 0;
      return {
        rich: (
          <FormattedMessage
            {...messages.zeroChecks}
            values={{
              formattedCount: <strong>{countNoChecks}</strong>,
            }}
          />
        ),
        plain: intl.formatMessage(messages.zeroChecks, {
          formattedCount: countNoChecks,
        }),
      };
    }
    const counts = intl.formatMessage(messages.mergeCheckCount, {
      resolved: this.countPassedMergeChecks(),
      total: mergeCheckItems.length,
    });
    const status = intl.formatMessage(messages.checksPassed, {
      total: mergeCheckItems.length,
    });

    return {
      rich: (
        <div>
          <styles.MergeChecksNumber>
            <FormattedMessage
              {...messages.mergeCheckCount}
              values={{
                resolved: this.countPassedMergeChecks(),
                total: mergeCheckItems.length,
              }}
            />
          </styles.MergeChecksNumber>{' '}
          <FormattedMessage
            {...messages.checksPassed}
            values={{
              total: mergeCheckItems.length,
            }}
          />
        </div>
      ),
      plain: `${counts} ${status}`,
    };
  }

  renderExpanderChildren() {
    const {
      mergeCheckItems,
      userLevel,
      repositoryFullSlug,
      mergeChecksError,
      retryFetchMergeChecks,
    } = this.props;

    if (mergeChecksError) {
      return (
        <GenericMessage
          iconType="warning"
          title={<FormattedMessage {...messages.errorHeading} />}
        >
          <Button appearance="link" onClick={retryFetchMergeChecks}>
            <FormattedMessage {...messages.errorAction} />
          </Button>
        </GenericMessage>
      );
    }

    // must be repo admin to see branch permissions
    if (mergeCheckItems.length === 0 && userLevel === 'admin') {
      return (
        <MergeChecklistEmptyState repositoryFullSlug={repositoryFullSlug} />
      );
    }

    const sortedMergeCheckItems = sortMergeChecklist(mergeCheckItems);

    return sortedMergeCheckItems.map(mergeCheck => {
      return mergeCheck.pass ? (
        <styles.MergeCheck key={mergeCheck.key}>
          <styles.IconWrapper>
            {<CheckCircleIcon primaryColor={colors.G300} label="" />}
          </styles.IconWrapper>
          {mergeCheck.label}
        </styles.MergeCheck>
      ) : (
        <styles.MergeCheck key={mergeCheck.key}>
          <styles.IconWrapper>
            <GrayIcon />
          </styles.IconWrapper>
          {mergeCheck.label}
        </styles.MergeCheck>
      );
    });
  }

  renderSecondaryIcon = (isCollapsed: boolean) => {
    const { isMergeable } = this.props;

    if (this.isLoading() || (!isCollapsed && !isMergeable)) {
      return null;
    }

    const secondaryIcon = isMergeable ? (
      <CheckCircleIcon primaryColor={colors.G300} label="" />
    ) : (
      <GrayIcon />
    );

    return <styles.IconSecondary>{secondaryIcon}</styles.IconSecondary>;
  };

  render() {
    const { isCollapsed, mergeCheckItems } = this.props;
    const { plain: plainLabel, rich: richLabel } = this.renderLabels();

    const icon = <BulletListIcon label="Merge checks" />;

    if (isCollapsed) {
      return (
        <Tooltip position="left" content={plainLabel}>
          <Button
            appearance="subtle"
            iconBefore={
              <styles.IconContainer>
                {icon}{' '}
                {mergeCheckItems.length > 0 &&
                  (this.countFailedMergeChecks() > 0 ? (
                    <styles.FailIndicator aria-label={plainLabel} />
                  ) : (
                    <styles.PassIndicator aria-label={plainLabel} />
                  ))}
              </styles.IconContainer>
            }
          />
        </Tooltip>
      );
    }

    /* eslint-disable react/no-children-prop */
    return (
      <Expander
        icon={icon}
        label={richLabel}
        defaultIsCollapsed={this.initialCardIsCollapsed()}
        onChange={this.onCardStatusChange}
        ariaLabel={plainLabel}
        isLoading={this.isLoading()}
        children={this.renderExpanderChildren()}
        renderSecondaryIcon={this.renderSecondaryIcon}
      />
    );
    /* eslint-enable react/no-children-prop */
  }
}

export default injectIntl(MergeChecklist);
