import React, { PureComponent } from 'react';
import { injectIntl, InjectedIntl } from 'react-intl';
import Button from '@atlaskit/button';
import { Checkbox } from '@atlaskit/checkbox';
import EditorLinkIcon from '@atlaskit/icon/glyph/editor/link';
import { Task } from 'src/components/types';
import { TaskStateChangeOptions } from 'src/redux/pull-request/types';
import * as styles from './tasks.style';
import messages from './tasks.i18n';

export type TaskProps = {
  intl: InjectedIntl;
  task: Task;
  canResolveTask?: boolean;
  isDeleting?: boolean;
  editView?: JSX.Element;
  onTaskStateChange: (options: TaskStateChangeOptions) => void;
  onTaskDelete?: (task: Task) => void;
  onCommentLinkClick?: (task: Task) => void;
  onTaskEditBegin?: (task: Task) => void;
};

class TaskComponent extends PureComponent<TaskProps> {
  handleTaskStateChange = () => {
    const { task } = this.props;
    this.props.onTaskStateChange({
      url: task.links.self.href,
      task,
      nextTaskState: task.state === 'RESOLVED' ? 'UNRESOLVED' : 'RESOLVED',
    });
  };

  render() {
    const {
      task,
      editView,
      canResolveTask,
      onTaskDelete,
      onCommentLinkClick,
      onTaskEditBegin,
      isDeleting,
      intl,
    } = this.props;
    return (
      <>
        <styles.TaskCheckboxWrapper>
          <Checkbox
            isChecked={task.state === 'RESOLVED'}
            isDisabled={!!editView || !canResolveTask || isDeleting}
            onChange={this.handleTaskStateChange}
            label={editView || task.content.raw}
            name={`${task.id}`}
            value={task.id}
            isFullWidth
          />
          {onCommentLinkClick && task.comment && (
            <Button
              onClick={() => onCommentLinkClick(task)}
              appearance="subtle"
              spacing="none"
            >
              <EditorLinkIcon
                label={intl.formatMessage(messages.linkToTaskComment)}
                size="medium"
              />
            </Button>
          )}
        </styles.TaskCheckboxWrapper>
        {(onTaskEditBegin || onTaskDelete) && (
          <styles.TaskModificationLinks hasSeparator>
            {onTaskEditBegin && (
              <li>
                <Button
                  appearance="subtle-link"
                  spacing="none"
                  onClick={() => onTaskEditBegin(task)}
                  disabled={isDeleting}
                >
                  {intl.formatMessage(messages.editTaskLabel)}
                </Button>
              </li>
            )}
            {onTaskDelete && (
              <li>
                <Button
                  appearance="subtle-link"
                  spacing="none"
                  onClick={() => onTaskDelete(task)}
                  disabled={isDeleting}
                >
                  {intl.formatMessage(messages.deleteTaskLabel)}
                </Button>
              </li>
            )}
          </styles.TaskModificationLinks>
        )}
      </>
    );
  }
}

export default injectIntl(TaskComponent);
