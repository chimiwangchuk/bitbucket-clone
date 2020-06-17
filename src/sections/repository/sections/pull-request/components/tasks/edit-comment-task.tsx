import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// @ts-ignore TODO: fix noImplicitAny error here
import Form, { Field } from '@atlaskit/form';
// @ts-ignore TODO: fix noImplicitAny error here
import Textfield from '@atlaskit/textfield';
import { Checkbox } from '@atlaskit/checkbox';
import Button from '@atlaskit/button';
import Spinner from '@atlaskit/spinner';

import { Task } from 'src/components/types';
import {
  TASK_EDIT,
  TOGGLE_EDIT_COMMENT_TASK_INPUT,
} from 'src/redux/pull-request/actions';
import { useIntl } from 'src/hooks/intl';
import { getTasksSlice } from 'src/selectors/task-selectors';
import { TASK_STATE } from 'src/redux/pull-request/tasks-reducer';
import * as commentStyles from './create-comment-task.style';
import * as styles from './create-task.style';
import messages from './create-task.i18n';
import editMessages from './tasks.i18n';
import * as taskStyles from './tasks.style';

type EditTaskSaveButtonsProps = {
  task: Task;
  isSubmitting: boolean;
  error?: string;
};

const EditTaskSaveButtons: React.FC<EditTaskSaveButtonsProps> = (
  props: EditTaskSaveButtonsProps
) => {
  const { task, isSubmitting, error } = props;
  const dispatch = useDispatch();
  const intl = useIntl();
  const handleCancel = () => {
    dispatch({
      type: TOGGLE_EDIT_COMMENT_TASK_INPUT,
      payload: { taskId: task.id, isEditing: false },
    });
  };
  return (
    <>
      {error && (
        <taskStyles.EditCommentTaskErrorMessage>
          {error}
        </taskStyles.EditCommentTaskErrorMessage>
      )}
      <taskStyles.TaskModificationLinks hasSeparator={false}>
        <li>
          {/* Click on the submit is handled by the outer form.onSubmit */}
          <Button type="submit" appearance="link" isDisabled={isSubmitting}>
            {intl.formatMessage(editMessages.saveEditTaskLabel)}
          </Button>
        </li>
        <li>
          <Button
            appearance="subtle-link"
            onClick={handleCancel}
            isDisabled={isSubmitting}
          >
            {intl.formatMessage(editMessages.cancelEditTaskLabel)}
          </Button>
        </li>
      </taskStyles.TaskModificationLinks>
    </>
  );
};

type EditCommentTaskProps = { task: Task };

export const EditCommentTask: React.FC<EditCommentTaskProps> = (
  props: EditCommentTaskProps
) => {
  const { task } = props;
  const intl = useIntl();
  const dispatch = useDispatch();
  const [newValue, setNewValue] = useState(task.content.raw);
  const { commentEditingTasks } = useSelector(getTasksSlice);
  const commentEditingTask = commentEditingTasks[task.id];
  const editingState = commentEditingTask && commentEditingTask.state;
  const error =
    commentEditingTask && commentEditingTask.state === TASK_STATE.ERROR
      ? commentEditingTask.error
      : undefined;
  const isSubmitting = editingState === TASK_STATE.SUBMITTING;
  const handleSubmit = () => {
    dispatch({
      type: TASK_EDIT.REQUEST,
      payload: { taskId: task.id, newValue },
    });
  };

  return (
    <commentStyles.EditCommentTask>
      <Form onSubmit={handleSubmit}>
        {({ formProps }: any) => (
          <form {...formProps}>
            <styles.CreateTaskContainer>
              <styles.CreateTaskIcon>
                <Checkbox
                  isChecked={task.state === 'RESOLVED'}
                  isDisabled
                  isFullWidth
                />
              </styles.CreateTaskIcon>
              <commentStyles.EditCommentFieldWrapper>
                <Field
                  name="createTask"
                  label=""
                  defaultValue={task.content.raw}
                >
                  {({ fieldProps }: any) => {
                    return (
                      <Textfield
                        appearance="subtle"
                        autoComplete="off"
                        autoFocus
                        {...fieldProps}
                        placeholder={intl.formatMessage(messages.createTask)}
                        isCompact
                        isDisabled={isSubmitting}
                        isInvalid={false}
                        aria-invalid={false}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          setNewValue(e.target.value);
                          fieldProps.onChange(e); // ensures enter key still submits the form
                        }}
                        value={newValue}
                        elemAfterInput={
                          isSubmitting && (
                            <styles.CreateTaskStatusWrapper>
                              <Spinner size="small" />
                            </styles.CreateTaskStatusWrapper>
                          )
                        }
                      />
                    );
                  }}
                </Field>
              </commentStyles.EditCommentFieldWrapper>
            </styles.CreateTaskContainer>
            <EditTaskSaveButtons
              task={task}
              error={error}
              isSubmitting={isSubmitting}
            />
          </form>
        )}
      </Form>
    </commentStyles.EditCommentTask>
  );
};
