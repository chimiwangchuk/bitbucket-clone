import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { injectIntl, InjectedIntl } from 'react-intl';
import Button from '@atlaskit/button';

import { getCommentsCountForFile } from 'src/selectors/conversation-selectors';
import { OPEN_DIFF_COMMENTS_DIALOG } from 'src/redux/pull-request/actions';
import { extractFilepath } from 'src/utils/extract-file-path';
import { Diff } from 'src/types/pull-request';

import messages from './diff-comments-dialog-trigger.i18n';

type Props = {
  file: Diff;
  intl: InjectedIntl;
  commentsCount: number;
  onClick: () => void;
};

function DiffCommentsDialogTrigger(props: Props) {
  const { intl, commentsCount, onClick } = props;

  if (commentsCount) {
    return (
      <li>
        <Button appearance="link" onClick={onClick} spacing="none">
          {intl.formatMessage(messages.title, {
            commentsCount,
          })}
        </Button>
      </li>
    );
  }

  return null;
}

// @ts-ignore TODO: fix noImplicitAny error here
function mapStateToProps(state, { file }) {
  return {
    commentsCount: getCommentsCountForFile(state, { file }),
  };
}

// @ts-ignore TODO: fix noImplicitAny error here
function mapDispathToProps(dispatch, { file }) {
  const filepath = extractFilepath(file);

  return {
    onClick: () =>
      dispatch({
        type: OPEN_DIFF_COMMENTS_DIALOG,
        payload: filepath,
      }),
  };
}

export default compose<any, any, any>(
  connect(mapStateToProps, mapDispathToProps),
  injectIntl
)(DiffCommentsDialogTrigger);
