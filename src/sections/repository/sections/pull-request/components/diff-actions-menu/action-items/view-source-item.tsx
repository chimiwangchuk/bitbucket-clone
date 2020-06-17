import React, { RefObject, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { DropdownItem } from '@atlaskit/dropdown-menu';

import { publishPullRequestUiEvent } from 'src/redux/pull-request/actions';

import SourceFileLink from '../../../containers/source-file-link';
import messages from '../../diff.i18n';

type Props = {
  filepath: string;
  isDeleted?: boolean;
};

export const ViewSourceItem: React.FC<Props> = ({ filepath, isDeleted }) => {
  const dispatch = useDispatch();

  const OpenLink = useMemo(
    () =>
      React.forwardRef(
        (
          { className }: { className: string },
          ref: RefObject<HTMLAnchorElement>
        ) => (
          <SourceFileLink
            className={className}
            filepath={filepath}
            target="_blank"
            isDeleted={!!isDeleted}
            ref={ref}
            role="menuitem"
            onClick={() =>
              dispatch(
                publishPullRequestUiEvent({
                  action: 'clicked',
                  actionSubject: 'button',
                  actionSubjectId: 'pullRequestOpenInSourceButton',
                })
              )
            }
          >
            <FormattedMessage {...messages.viewFile} />
          </SourceFileLink>
        )
      ),
    [dispatch, filepath, isDeleted]
  );

  return <DropdownItem key="file-actions-menu-view" linkComponent={OpenLink} />;
};
