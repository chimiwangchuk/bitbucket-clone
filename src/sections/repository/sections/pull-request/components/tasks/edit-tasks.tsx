import React, { PureComponent } from 'react';
import { FormattedMessage, injectIntl, InjectedIntl } from 'react-intl';
import Button from '@atlaskit/button';
import EditorCloseIcon from '@atlaskit/icon/glyph/editor/close';
import TextArea from '@atlaskit/textarea';
// @ts-ignore TODO: fix noImplicitAny error here
import Form, { Field, ErrorMessage } from '@atlaskit/form';
import { TaskStateChangeOptions } from 'src/redux/pull-request/types';
import commonMessages from 'src/i18n/common';
import { Task } from 'src/components/types';
import { ScreenReadersOnly } from 'src/components/accessibility';
import {
  TaskMap,
  DeleteTaskLoadingMap,
  TasksErrorMap,
} from 'src/redux/pull-request/tasks-reducer';

import messages from './edit-tasks.i18n';
import TaskComponent from './task';
import { TaskCardFooter } from './tasks.style';
import { taskKey } from './utils';
import * as styles from './edit-tasks.style';

export type EditTasksProps = {
  intl: InjectedIntl;
  tasks: Task[];
  onCancel: () => void;
  onTasksSave: (editTasksFormData: TaskMap<string>) => void;
  onTasksSaveSuccess: () => void;
  onTaskStateChange: (options: TaskStateChangeOptions) => void;
  onTaskDelete: (task: Task) => void;
  clearTaskErrors: () => void;
  editTasksHasErrors: boolean;
  taskErrors: TasksErrorMap;
  tasksErrorMessages: string[];
  isEditTasksSubmitting: boolean;
  isDeleteTaskSubmitting: DeleteTaskLoadingMap;
  modifiableTasks: string[];
  canEditSomeTasks: boolean;
};

export type EditTasksState = {
  editTaskFieldIds: TaskMap<string>;
};

class EditTasksBase extends PureComponent<EditTasksProps, EditTasksState> {
  state = {
    editTaskFieldIds: {},
  };

  componentDidMount() {
    const editTaskFieldIds: TaskMap<string> = {};
    Object.entries(this.fieldRefs).forEach(([key, ref]) => {
      if (ref) {
        editTaskFieldIds[key] = `${ref.id}-error`;
      }
    });
    this.setState({ editTaskFieldIds });
  }

  componentDidUpdate(prevProps: EditTasksProps) {
    if (
      prevProps.isEditTasksSubmitting &&
      !this.props.isEditTasksSubmitting &&
      !this.props.editTasksHasErrors
    ) {
      this.props.onTasksSaveSuccess();
    }

    if (prevProps.canEditSomeTasks && !this.props.canEditSomeTasks) {
      this.props.onCancel();
    }
  }

  fieldRefs: TaskMap<HTMLTextAreaElement | null> = {};

  blurAllFields = () => {
    Object.values(this.fieldRefs).forEach(field => {
      if (field) {
        field.blur();
      }
    });
  };

  handleSubmit = (formData: { [key: string]: string }) => {
    this.blurAllFields();
    this.props.onTasksSave(formData);
  };

  handleCancel = () => {
    this.props.clearTaskErrors();
    this.props.onCancel();
  };

  handleDelete = (task: Task) => {
    this.props.onTaskDelete(task);
  };

  // @ts-ignore TODO: fix noImplicitAny error here
  renderTask(params) {
    const { intl, onTaskStateChange } = this.props;
    const { task, isDeleting, isDisabled, taskHasError } = params;

    return (
      <styles.EditTaskContainer key={task.id}>
        <Field
          name={taskKey(task)}
          defaultValue={task.content.raw}
          isDisabled={isDisabled}
          isRequired
        >
          {({ fieldProps }: any) => {
            const editView = (
              <styles.EditTaskView>
                <styles.TextFieldContainer>
                  <TextArea
                    {...fieldProps}
                    isCompact
                    ref={ref => {
                      this.fieldRefs[taskKey(task)] = ref;
                    }}
                    isInvalid={taskHasError}
                  />
                </styles.TextFieldContainer>
                <styles.DeleteButtonContainer>
                  <Button
                    isDisabled={isDisabled || isDeleting}
                    isLoading={isDeleting}
                    spacing="compact"
                    onClick={() => this.handleDelete(task)}
                    appearance="subtle-link"
                    iconAfter={
                      <EditorCloseIcon
                        size="small"
                        label={intl.formatMessage(messages.deleteTaskIconLabel)}
                      />
                    }
                  />
                </styles.DeleteButtonContainer>
              </styles.EditTaskView>
            );

            return (
              <TaskComponent
                task={task}
                onTaskStateChange={onTaskStateChange}
                editView={editView}
              />
            );
          }}
        </Field>
      </styles.EditTaskContainer>
    );
  }

  render() {
    const {
      tasks,
      isEditTasksSubmitting,
      taskErrors,
      editTasksHasErrors,
      tasksErrorMessages,
      isDeleteTaskSubmitting,
      modifiableTasks,
    } = this.props;

    const { editTaskFieldIds } = this.state;

    const tasksHasError = tasksErrorMessages && tasksErrorMessages.length !== 0;

    return (
      <Form onSubmit={this.handleSubmit}>
        {({ formProps, dirty }: any) => (
          <form {...formProps}>
            <styles.EditTaskList hasError={!!tasksHasError}>
              {tasks.map(task => {
                const taskHasError =
                  !!taskErrors && taskKey(task) in taskErrors;

                // for a partial success disable editing
                // of any tasks that aren't apart of the failure
                // (i.e. either were successfully saved or never
                // edited in the firsrt place)
                const isDisabled =
                  task.state === 'RESOLVED' ||
                  !modifiableTasks.includes(taskKey(task)) ||
                  (editTasksHasErrors ? !taskHasError : isEditTasksSubmitting);

                const isDeleting =
                  taskKey(task) in isDeleteTaskSubmitting &&
                  isDeleteTaskSubmitting[taskKey(task)];

                return this.renderTask({
                  taskHasError,
                  isDisabled,
                  isDeleting,
                  task,
                });
              })}
            </styles.EditTaskList>
            {tasksHasError ? (
              <>
                <styles.ErrorMessageContainer aria-hidden="true">
                  <ErrorMessage>
                    <styles.ErrorMessageList>
                      {tasksErrorMessages.map(message => (
                        <li key={message}>{message}</li>
                      ))}
                    </styles.ErrorMessageList>
                  </ErrorMessage>
                </styles.ErrorMessageContainer>
                {Object.entries(taskErrors).map(([key, errorMessage]) => {
                  return (
                    <ScreenReadersOnly
                      key={key}
                      // @ts-ignore TODO: fix noImplicitAny error here
                      id={editTaskFieldIds[key] || undefined}
                    >
                      {errorMessage}
                    </ScreenReadersOnly>
                  );
                })}
              </>
            ) : null}
            <TaskCardFooter kind="save">
              <Button
                appearance="subtle-link"
                onClick={this.handleCancel}
                isDisabled={isEditTasksSubmitting}
              >
                <FormattedMessage {...commonMessages.cancel} />
              </Button>
              <Button
                type="submit"
                appearance="link"
                isDisabled={isEditTasksSubmitting || !dirty}
                isLoading={isEditTasksSubmitting}
              >
                <FormattedMessage {...messages.saveTasksButtonText} />
              </Button>
            </TaskCardFooter>
          </form>
        )}
      </Form>
    );
  }
}

export const EditTasks = injectIntl(EditTasksBase);
