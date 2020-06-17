import React, { ReactNode, Fragment, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import Flag from '@atlaskit/flag';
import { colors } from '@atlaskit/theme';
import InfoIcon from '@atlaskit/icon/glyph/info';
import messages from 'src/sections/repository/sections/pull-request/pull-request.i18n';
import DiscardCommentsDialog from 'src/sections/repository/sections/pull-request/components/discard-comments-dialog';
import scrollTo from 'src/redux/global/actions/scroll-to';
import { PR_UPDATE_FLAG_ID } from 'src/redux/pull-request/sagas/poll-pullrequest-updates-saga';
import { useIntl } from 'src/hooks/intl';
import { REFRESH_CODE_REVIEW_DATA_FROM_POLL_RESULTS } from 'src/redux/pull-request/actions';
import { getEditorState } from 'src/redux/pull-request/selectors';
import { BucketState } from 'src/types/state';
import { AppearanceTypes } from './simple/simple-flag';

type Props = {
  id: typeof PR_UPDATE_FLAG_ID;
  onDismissed: (id: string) => void;
  isEditorOpen: boolean;
};

type ActionType = {
  content: ReactNode;
  onClick?: () => void;
  href?: string;
  target?: string;
};

const mapStateToProps = (state: BucketState) => ({
  isEditorOpen: getEditorState(state),
});

export const PullRequestUpdatedFlag = connect(mapStateToProps)(
  React.memo(({ id, onDismissed, isEditorOpen, ...props }: Props) => {
    const [showDiscardCommentsDialog, setShowDiscardCommentsDialog] = useState(
      false
    );
    const intl = useIntl();
    const dispatch = useDispatch();
    const handleUpdate = () => {
      dispatch({ type: REFRESH_CODE_REVIEW_DATA_FROM_POLL_RESULTS });
      dispatch(
        scrollTo({
          targetId: 'root',
        })
      );
      onDismissed(id);
    };
    const refreshAction: ActionType = {
      content: intl.formatMessage(messages.reload),
      onClick: () => {
        if (isEditorOpen) {
          setShowDiscardCommentsDialog(true);
        } else {
          handleUpdate();
        }
      },
    };

    const handleDiscardComments = () => {
      setShowDiscardCommentsDialog(false);
      handleUpdate();
    };

    const handleDiscardCommentsCancel = () => {
      setShowDiscardCommentsDialog(false);
    };

    return (
      <Fragment>
        <Flag
          id={id}
          title={intl.formatMessage(messages.pullRequestUpdated)}
          appearance={AppearanceTypes.normal}
          description=""
          icon={<InfoIcon label="" primaryColor={colors.P300} />}
          actions={[refreshAction]}
          isDismissAllowed
          onDismissed={onDismissed}
          {...props}
        />
        {showDiscardCommentsDialog && (
          <DiscardCommentsDialog
            onCancel={handleDiscardCommentsCancel}
            onDiscard={handleDiscardComments}
          >
            <FormattedMessage
              {...messages.discardCommentsModalBody}
              tagName="p"
            />
          </DiscardCommentsDialog>
        )}
      </Fragment>
    );
  })
);
