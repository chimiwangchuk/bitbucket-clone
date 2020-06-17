import React, { FunctionComponent } from 'react';
// @ts-ignore TODO: fix noImplicitAny error here
import GlobalNavigation from '@atlaskit/global-navigation';
import ArrowLeftIcon from '@atlaskit/icon/glyph/arrow-left';
// @ts-ignore TODO: fix noImplicitAny error here
import { ThemeProvider } from '@atlaskit/navigation-next';

import * as styles from './focused-navigation-next.style';
import { focusedNavigation } from './theme-modes';

type Props = {
  backButtonUrl: string;
  backButtonTooltip: string;
  onBackButtonClick?: () => void;
};

const FocusedNavigation: FunctionComponent<Props> = ({
  backButtonUrl,
  backButtonTooltip,
  onBackButtonClick,
}) => {
  const handleBackButtonClick = (e: React.MouseEvent) => {
    if (onBackButtonClick) {
      e.preventDefault();
      onBackButtonClick();
    }
  };
  return (
    // @ts-ignore TODO: fix noImplicitAny error here
    <ThemeProvider theme={theme => ({ ...theme, mode: focusedNavigation })}>
      <styles.FocusedNavigationWrapper>
        <GlobalNavigation
          productIcon={ArrowLeftIcon}
          productHref={backButtonUrl}
          productTooltip={backButtonTooltip}
          onProductClick={handleBackButtonClick}
        />
      </styles.FocusedNavigationWrapper>
    </ThemeProvider>
  );
};

export default FocusedNavigation;
