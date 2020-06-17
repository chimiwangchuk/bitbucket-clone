import React, { PureComponent } from 'react';
import { FormattedMessage, injectIntl, InjectedIntl } from 'react-intl';
import TaskIcon from '@atlaskit/icon/glyph/task';
import Tooltip from '@atlaskit/tooltip';
import Button from '@atlaskit/button';

import { Expander, ExpanderOnChangeEvent } from 'src/components/sidebar';
import { Task } from 'src/components/types';
import { TaskStateChangeOptions } from 'src/redux/pull-request/types';
import { PullRequestFetchProps } from 'src/types/pull-request';
import GenericMessage from 'src/components/generic-message';
import commonMessages from 'src/i18n/common';
import { publishUiEvent } from 'src/utils/analytics/publish';
import CreateTask from '../../containers/create-task';
import EditTasks from '../../containers/edit-tasks';
import TaskComponent from './task';
import * as styles from './tasks.style';
import messages from './tasks.i18n';

type TaskListProps = {
  isCollapsed: boolean;
  initialMode: TaskMode;
  isSidebarCollapsed: boolean;
  shouldRepressFetch: boolean;
  owner: string;
  repoSlug: string;
  pullRequestId: number;
  onFetchTasks: (obj: PullRequestFetchProps) => void;
  onTaskStateChange: (options: TaskStateChangeOptions) => void;
  onExpandChange: (ev: ExpanderOnChangeEvent) => void;
  tasks: Task[];
  isLoading: boolean;
  hasError: boolean;
  intl: InjectedIntl;
  canResolveTask: boolean;
  modifiableTasks: string[];
  repositoryUUID: string | null;
  onCommentLinkClick?: (task: Task) => void;
};

export enum TaskMode {
  Read,
  Edit,
}

type TaskListState = {
  mode: TaskMode;
};

class TaskListComponent extends PureComponent<TaskListProps, TaskListState> {
  static defaultProps = {
    initialMode: TaskMode.Read,
  };

  state = {
    mode: this.props.initialMode,
  };

  componentDidMount() {
    if (!this.props.shouldRepressFetch) {
      this.fetchTasks();
    }
  }

  fetchTasks = () => {
    const { onFetchTasks, owner, repoSlug, pullRequestId } = this.props;
    onFetchTasks({ owner, repoSlug, pullRequestId });
  };

  countResolvedTasks = () => {
    return this.props.tasks.filter(task => task.state === 'RESOLVED').length;
  };

  enterReadMode = () => this.setState({ mode: TaskMode.Read });

  enterEditMode = () => this.setState({ mode: TaskMode.Edit });

  renderExpanderLabel() {
    if (this.props.isLoading) {
      return null;
    }

    return (
      <div>
        <styles.TaskNumber>
          <FormattedMessage
            {...messages.taskCounts}
            values={{
              resolvedTaskCount: this.countResolvedTasks(),
              totalTaskCount: this.props.tasks.length,
            }}
          />
        </styles.TaskNumber>{' '}
        <FormattedMessage
          {...messages.tasksCompleted}
          values={{
            totalTaskCount: this.props.tasks.length,
          }}
        />
      </div>
    );
  }

  renderExpanderLabelPlain() {
    if (this.props.isLoading) {
      return null;
    }

    const counts = this.props.intl.formatMessage(messages.taskCounts, {
      resolvedTaskCount: this.countResolvedTasks(),
      totalTaskCount: this.props.tasks.length,
    });
    const status = this.props.intl.formatMessage(messages.tasksCompleted, {
      totalTaskCount: this.props.tasks.length,
    });
    return `${counts} ${status}`;
  }

  handleTaskStateChange = (options: TaskStateChangeOptions) => {
    const { nextTaskState: state } = options;

    publishUiEvent({
      action: state === 'RESOLVED' ? 'resolved' : 'unresolved',
      actionSubject: 'task',
      actionSubjectId: 'pullRequestTask',
      source: 'pullRequestScreen',
      objectType: 'pullRequest',
      objectId: `${this.props.repositoryUUID}/${this.props.pullRequestId}`,
      containerId: `${this.props.repositoryUUID}`,
      containerType: 'repository',
      attributes: {
        taskLocation: 'sidebar',
      },
    });

    this.props.onTaskStateChange(options);
  };

  renderReadMode() {
    const {
      tasks,
      canResolveTask,
      modifiableTasks,
      onCommentLinkClick,
    } = this.props;

    const taskList = () => (
      <styles.TaskList id="sidebar-tasks">
        {tasks.map(task => (
          <styles.TaskContainer key={task.id}>
            <TaskComponent
              task={task}
              onTaskStateChange={this.handleTaskStateChange}
              canResolveTask={canResolveTask}
              onCommentLinkClick={onCommentLinkClick}
            />
          </styles.TaskContainer>
        ))}
      </styles.TaskList>
    );

    const editTaskTrigger = () => (
      <styles.TaskCardFooter kind="edit">
        <Button
          appearance="subtle-link"
          onClick={this.enterEditMode}
          isDisabled={this.countResolvedTasks() === tasks.length}
        >
          <FormattedMessage {...messages.editTasksButtonText} />
        </Button>
      </styles.TaskCardFooter>
    );

    return (
      <>
        {tasks.length ? taskList() : null}
        <CreateTask />
        {modifiableTasks.length ? editTaskTrigger() : null}
      </>
    );
  }

  renderEditMode() {
    const { tasks, onTaskStateChange } = this.props;
    return (
      <EditTasks
        tasks={tasks}
        onTaskStateChange={onTaskStateChange}
        onCancel={this.enterReadMode}
        onTasksSaveSuccess={this.enterReadMode}
      />
    );
  }

  renderTasks() {
    const { hasError } = this.props;
    const { mode } = this.state;

    if (hasError) {
      return (
        <GenericMessage
          iconType="warning"
          title={<FormattedMessage {...messages.errorHeading} />}
        >
          <Button appearance="link" onClick={this.fetchTasks}>
            <FormattedMessage {...commonMessages.tryAgain} />
          </Button>
        </GenericMessage>
      );
    }

    return mode === TaskMode.Read
      ? this.renderReadMode()
      : this.renderEditMode();
  }

  render() {
    const {
      intl,
      onExpandChange,
      isLoading,
      isCollapsed,
      isSidebarCollapsed,
    } = this.props;

    const icon = <TaskIcon label={intl.formatMessage(messages.label)} />;

    if (isSidebarCollapsed) {
      return (
        <Tooltip position="left" content={this.renderExpanderLabelPlain()}>
          <Button appearance="subtle" iconBefore={icon} />
        </Tooltip>
      );
    }

    return (
      <Expander
        icon={icon}
        isCollapsed={isCollapsed}
        isLoading={isLoading}
        label={this.renderExpanderLabel()}
        onChange={onExpandChange}
        ariaLabel={intl.formatMessage(messages.label)}
      >
        {this.renderTasks()}
      </Expander>
    );
  }
}

export default injectIntl(TaskListComponent);
