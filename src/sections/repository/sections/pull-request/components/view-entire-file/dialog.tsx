import { ThemeProvider } from 'emotion-theming';
import React, { useMemo } from 'react';
import ErrorIcon from '@atlaskit/icon/glyph/error';
import ModalDialog, {
  HeaderComponentProps,
  ModalHeader,
} from '@atlaskit/modal-dialog';
import { ActionProps } from '@atlaskit/modal-dialog/dist/esm/types';
import { colors } from '@atlaskit/theme';
import { FormattedMessage } from 'react-intl';

import Path from 'src/components/path';
import { useIntl } from 'src/hooks/intl';
import commonMessages from 'src/i18n/common';

import { DiffStatStatus } from 'src/types/diffstat';
import { getFileDiffSize } from 'src/utils/get-file-diff-size';
import { useDiffPreferences as useDiffPreferencesDI } from '../../hooks/diffs';
import { usePullRequestScreenEvent } from '../../hooks/analytics';
import messages from './i18n';
import {
  DialogTitle,
  DialogTitleIcon,
  DialogTitleText,
  ModalLoading,
} from './styled';
import { TooLargeMessage } from './too-large-message';
import { useViewEntireFileState as useViewEntireFileStateDI } from './hooks';
import { ActionsMenu } from './components/actions-menu';
import { DiffEntireFile } from './diff-entire-file';

// This fixes a weird bug where the default theme isn't being recognized and the box shadow
// color of the keyline is applied incorrectly
const LIGHT_THEME = (theme: object) => ({ ...theme, mode: 'light' });

const getComponentOverrides = ({
  useViewEntireFileState = useViewEntireFileStateDI,
  useDiffPreferences = useDiffPreferencesDI,
}) => {
  const Container = React.memo(props => (
    <ThemeProvider theme={LIGHT_THEME} {...props} />
  ));

  const Header = React.memo((props: HeaderComponentProps) => {
    const intl = useIntl();
    const { path, isTooLarge, hasError, diffFile } = useViewEntireFileState();

    const icon =
      props.appearance === 'danger' ? (
        <DialogTitleIcon>
          <ErrorIcon label="" primaryColor={colors.R400} />
        </DialogTitleIcon>
      ) : null;

    const text = isTooLarge ? (
      intl.formatMessage(messages.tooLargeHeader)
    ) : hasError ? (
      intl.formatMessage(commonMessages.errorHeading)
    ) : path ? (
      <Path>{path.split('/')}</Path>
    ) : null;

    return (
      <ModalHeader {...props}>
        <DialogTitle>
          {icon}
          <DialogTitleText>{text}</DialogTitleText>
        </DialogTitle>
        {!isTooLarge && !hasError && (
          <ActionsMenu
            path={path}
            isDeleted={diffFile?.fileDiffStatus === DiffStatStatus.Removed}
            useDiffPreferences={useDiffPreferences}
            useViewEntireFileState={useViewEntireFileState}
          />
        )}
      </ModalHeader>
    );
  });
  return { Container, Header };
};

type Props = {
  useViewEntireFileState?: typeof useViewEntireFileStateDI;
  useDiffPreferences?: typeof useDiffPreferencesDI;
};

export const ViewEntireFileDialog: React.FC<Props> = React.memo(
  ({
    useViewEntireFileState = useViewEntireFileStateDI,
    useDiffPreferences = useDiffPreferencesDI,
  }) => {
    const intl = useIntl();

    const {
      isLoading,
      hasError,
      isTooLarge,
      diffFile,
      path,
      handleClose,
    } = useViewEntireFileState();

    const actions: ActionProps[] = useMemo(
      () => [
        {
          appearance: 'subtle',
          onClick: handleClose,
          text: hasError
            ? intl.formatMessage(messages.confirmButton)
            : intl.formatMessage(commonMessages.close),
        },
      ],
      [handleClose, hasError, intl]
    );

    const componentOverrides = useMemo(
      () =>
        getComponentOverrides({
          useViewEntireFileState,
          useDiffPreferences,
        }),
      [useViewEntireFileState, useDiffPreferences]
    );

    const sizeProps =
      isTooLarge || hasError
        ? { width: 'medium' }
        : { height: '100%', width: '90%' };

    usePullRequestScreenEvent({
      name: 'entireFileDiffModal',
      attributes: {
        isTooLarge,
        fileLineCount: diffFile && getFileDiffSize(diffFile),
      },
      skip: !diffFile,
    });

    return (
      <ModalDialog
        actions={actions}
        appearance={isTooLarge || hasError ? 'danger' : undefined}
        components={componentOverrides}
        onClose={handleClose}
        {...sizeProps}
      >
        {isLoading && <ModalLoading size="medium" />}
        {!isLoading && hasError && (
          <FormattedMessage
            {...messages.serverError}
            tagName="p"
            values={{
              statusLink: (
                <a
                  target="_blank"
                  href="https://bitbucket.status.atlassian.com"
                >
                  {intl.formatMessage(messages.bitbucketStatusPage)}
                </a>
              ),
            }}
          />
        )}
        {!isLoading && !hasError && isTooLarge && (
          <TooLargeMessage path={path} />
        )}
        {!isLoading && !hasError && !isTooLarge && diffFile && (
          <DiffEntireFile
            diffFile={diffFile}
            useDiffPreferences={useDiffPreferences}
          />
        )}
      </ModalDialog>
    );
  }
);
