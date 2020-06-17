import React from 'react';
import { useDispatch } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import Button from '@atlaskit/button';
import { Diff } from 'src/types/pull-request';
import { extractFilepath } from 'src/utils/extract-file-path';
import { OPEN_OUTDATED_COMMENTS_DIALOG } from 'src/redux/pull-request/actions';
import { messages } from './outdated-comments.i18n';
import * as styles from './outdated-comments.style';

export type OutdatedCommentsProps = {
  count: number;
  file: Diff;
};

export const BaseOutdatedCommentsButton = (props: OutdatedCommentsProps) => {
  const dispatch = useDispatch();
  const { count, file } = props;

  if (!count) {
    return null;
  }
  const filepath = extractFilepath(file);
  const onClick = (event: React.MouseEvent) => {
    event.stopPropagation();

    dispatch({
      type: OPEN_OUTDATED_COMMENTS_DIALOG,
      payload: filepath,
    });
  };

  return (
    <styles.OutdatedCommentsButtonWrapper>
      <Button onClick={onClick} spacing="compact">
        <FormattedMessage
          {...messages.trigger}
          values={{ number_of_outdated_comments: count }}
          tagName="strong"
        />
      </Button>
    </styles.OutdatedCommentsButtonWrapper>
  );
};

export const OutdatedCommentsButton = React.memo(BaseOutdatedCommentsButton);
