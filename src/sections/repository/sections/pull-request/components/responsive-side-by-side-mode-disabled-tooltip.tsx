import Tooltip, { TooltipProps } from '@atlaskit/tooltip';
import React, { ReactElement } from 'react';
import { defineMessages } from 'react-intl';
import { useSelector } from 'react-redux';

import { useIntl } from 'src/hooks/intl';
import { getIsMobileHeaderActive } from 'src/selectors/global-selectors';

const messages = defineMessages({
  toolTipSideBySideDisabled: {
    id: 'frontbucket.repository.pullRequest.toolTipSideBySideDisabled',
    description: 'Text for tooltip appearing over disabled side-by-side action',
    defaultMessage: 'Side-by-side is unavailable',
  },
});

// `content` is required by Tooltip, but we supply our own in here so the consumer doesn't need to
type Props = Omit<TooltipProps, 'content'> & {
  children: (isSideBySideModeDisabled: boolean) => ReactElement;
};

export const ResponsiveSideBySideModeDisabledTooltip: React.FC<Props> = (
  props: Props
) => {
  const { children, ...otherProps } = props;
  const intl = useIntl();

  const isMobileHeaderActive = useSelector(getIsMobileHeaderActive);

  if (isMobileHeaderActive) {
    return (
      <Tooltip
        {...otherProps}
        content={intl.formatMessage(messages.toolTipSideBySideDisabled)}
      >
        {children(isMobileHeaderActive)}
      </Tooltip>
    );
  }

  return children(isMobileHeaderActive);
};
