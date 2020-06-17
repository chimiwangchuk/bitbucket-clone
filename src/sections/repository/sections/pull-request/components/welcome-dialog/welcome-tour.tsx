import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage, InjectedIntl } from 'react-intl';

import { publishUiEvent } from 'src/utils/analytics/publish';

import { setWelcomeTourActive } from 'src/redux/pull-request/actions';
import scrollTo, { ScrollToPayload } from 'src/redux/global/actions/scroll-to';
import { getIsWelcomeTourActive } from 'src/redux/pull-request/selectors';
import updateMobileHeaderState from 'src/redux/global/actions/update-mobile-header-state';

import { BucketState } from 'src/types/state';
import Spotlight from './lazy-spotlight';
import { PullRequestWelcomeTourTarget } from './types';
import messages from './welcome-tour.i18n';

export const ORDERED_TARGETS = [
  PullRequestWelcomeTourTarget.Files,
  PullRequestWelcomeTourTarget.Sidebar,
  PullRequestWelcomeTourTarget.Feedback,
];

type Props = {
  intl: InjectedIntl;
  isActive: boolean;
  endTour: () => void;
  closeMobileSidebar: () => void;
  scrollIntoView: (options: ScrollToPayload) => void;
};

const SCROLL_TIMEOUT = 100;

export function WelcomeTour({
  isActive,
  endTour,
  scrollIntoView,
  intl,
  closeMobileSidebar,
}: Props) {
  const [currentItem, setCurrentItem] = useState<number | null>(null);

  useEffect(() => {
    if (isActive) {
      scrollIntoView({
        targetId: ORDERED_TARGETS[0],
        customBehavior: 'instant',
        block: 'nearest',
        inline: 'nearest',
      });
      setTimeout(() => setCurrentItem(0), SCROLL_TIMEOUT);
    } else {
      setCurrentItem(null);
    }
  }, [isActive, scrollIntoView]);

  if (currentItem === null) {
    return null;
  }

  // @ts-ignore TODO: fix noImplicitAny error here
  const publishEvent = (action, actionSubject, actionSubjectId) => {
    publishUiEvent({
      action,
      actionSubject,
      actionSubjectId,
      source: 'welcomeTour',
    });
  };

  const handleNextClick = () => {
    scrollIntoView({
      targetId: ORDERED_TARGETS[currentItem + 1],
      duration: SCROLL_TIMEOUT,
      customBehavior: actions =>
        // @ts-ignore TODO: fix noImplicitAny error here
        actions.forEach(({ el, top }) => {
          // scroll only vertically
          el.scrollTop = top;
        }),
    });
    setTimeout(() => setCurrentItem(currentItem + 1), SCROLL_TIMEOUT);
  };

  const handleCancelClick = () => {
    publishEvent('clicked', 'button', 'cancel');
    endTour();
    closeMobileSidebar();
  };

  const handleFinishClick = () => {
    publishEvent('clicked', 'button', 'finish');
    endTour();
    closeMobileSidebar();
  };

  const guides = ORDERED_TARGETS.map((target, i) => {
    let actions = [
      {
        onClick: handleCancelClick,
        autoFocus: false,
        text: <FormattedMessage {...messages.common.cancelAction} />,
      },
      {
        onClick: handleNextClick,
        autoFocus: true,
        text: <FormattedMessage {...messages.common.nextAction} />,
      },
    ];
    if (i === ORDERED_TARGETS.length - 1) {
      actions = [
        {
          onClick: handleFinishClick,
          autoFocus: false,
          text: <FormattedMessage {...messages.common.finishAction} />,
        },
      ];
    }

    return (
      <Spotlight
        actions={actions}
        dialogPlacement="left middle"
        heading={intl.formatMessage(messages[target].title)}
        target={target}
        key={target}
        actionsBeforeElement={`${i + 1}/${ORDERED_TARGETS.length}`}
        targetRadius={3}
      >
        <FormattedMessage {...messages[target].guide} />
      </Spotlight>
    );
  });

  return guides[currentItem];
}

const mapStateToProps = (state: BucketState) => ({
  isActive: getIsWelcomeTourActive(state),
});

// @ts-ignore TODO: fix noImplicitAny error here
const mapDispatchToProps = dispatch => ({
  endTour: () => dispatch(setWelcomeTourActive(false)),
  scrollIntoView: (options: ScrollToPayload) => dispatch(scrollTo(options)),
  closeMobileSidebar: () => dispatch(updateMobileHeaderState('none')),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(WelcomeTour));
