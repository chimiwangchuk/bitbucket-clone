import React, { useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import InfoIcon from '@atlaskit/icon/glyph/info';
import { colors } from '@atlaskit/theme';
import { FormattedMessage } from 'react-intl';
import { Button } from '@atlaskit/button/dist/cjs/components/Button';
import { getIsSingleFileModeActive } from 'src/redux/pull-request/selectors';
import { useIntl } from 'src/hooks/intl';
import { hiddenLoadable } from 'src/utils/loadable-configs';
import messages from './info-subheading.i18n';
import * as styles from './info-subheading.style';

export const InlineDialog = hiddenLoadable(() =>
  import(/* webpackChunkName: "inline-dialog" */ '@atlaskit/inline-dialog')
);

type Props = {
  shownInStickyHeader?: boolean;
};

const BaseSingleFileModeSubheading = (props: Props) => {
  const { shownInStickyHeader } = props;
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const isSingleFileMode = useSelector(getIsSingleFileModeActive);
  const intl = useIntl();

  const handleDialogToggle = useCallback(
    () => setIsDialogOpen(isOpen => !isOpen),
    [setIsDialogOpen]
  );

  const handleDialogOpen = useCallback(() => setIsDialogOpen(true), [
    setIsDialogOpen,
  ]);

  const handleDialogClose = useCallback(() => setIsDialogOpen(false), [
    setIsDialogOpen,
  ]);

  const dialogContent = (
    <styles.InlineDialogWrapper onMouseLeave={handleDialogClose}>
      {shownInStickyHeader && (
        <styles.DialogParagraph>
          <strong>
            {intl.formatMessage(messages.introSingleFileMode, {
              modeSubject: intl.formatMessage(messages.largePr),
            })}
          </strong>
        </styles.DialogParagraph>
      )}
      <styles.DialogParagraph>
        {isSingleFileMode ? (
          shownInStickyHeader ? (
            <FormattedMessage
              {...messages.dialogMsgSingleFileModeStickyHeader}
            />
          ) : (
            <FormattedMessage {...messages.dialogMsgSingleFileMode} />
          )
        ) : (
          <FormattedMessage {...messages.dialogMsgAllFileMode} />
        )}
      </styles.DialogParagraph>
    </styles.InlineDialogWrapper>
  );

  const infoIcon = (
    <InfoIcon
      label="info"
      size={shownInStickyHeader ? 'medium' : 'small'}
      primaryColor={colors.B400}
    />
  );

  return (
    <styles.Container shownInStickyHeader={shownInStickyHeader}>
      <InlineDialog
        placement={shownInStickyHeader ? 'bottom-end' : 'bottom-start'}
        content={dialogContent}
        isOpen={isDialogOpen}
        onClose={handleDialogClose}
      >
        <Button
          appearance="subtle"
          spacing="none"
          aria-label={intl.formatMessage(messages.triggerBtnLabel)}
          iconBefore={infoIcon}
          onMouseEnter={handleDialogOpen}
          onClick={handleDialogToggle}
          onFocus={handleDialogOpen}
        />
      </InlineDialog>
      {!shownInStickyHeader && (
        <styles.InlineContainer data-testid="dialogMessage">
          <FormattedMessage
            {...(isSingleFileMode
              ? messages.introSingleFileMode
              : messages.introAllFileMode)}
            values={{
              modeSubject: (
                <strong>{intl.formatMessage(messages.largePr)}</strong>
              ),
            }}
          />
        </styles.InlineContainer>
      )}
    </styles.Container>
  );
};

export const SingleFileModeSubheading = React.memo(
  BaseSingleFileModeSubheading
);
