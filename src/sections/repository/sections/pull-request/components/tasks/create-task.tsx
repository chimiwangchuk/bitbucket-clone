import React, { Fragment, PureComponent } from 'react';
import { injectIntl, InjectedIntl } from 'react-intl';
import EditorAddIcon from '@atlaskit/icon/glyph/editor/add';
import ErrorIcon from '@atlaskit/icon/glyph/error';
// @ts-ignore TODO: fix noImplicitAny error here
import Form, { Field } from '@atlaskit/form';
// @ts-ignore TODO: fix noImplicitAny error here
import Textfield from '@atlaskit/textfield';
import Spinner from '@atlaskit/spinner';
import { colors } from '@atlaskit/theme';
import { CreateTaskIcon, IconSizes } from '@atlassian/bitkit-icon';
import { publishUiEvent } from 'src/utils/analytics/publish';
import * as styles from './create-task.style';
import messages from './create-task.i18n';

export enum CreateTaskKind {
  Global,
  Comment,
}

type CreateTaskProps = {
  canCreateTask: boolean;
  kind?: CreateTaskKind;
  commentId?: string;
  createTaskErrorMessage: string;
  createTaskHasError: boolean;
  initialTaskText?: string;
  intl: InjectedIntl;
  isCreateTaskSubmitting: boolean;
  onTaskCreate: (task: string, commentId?: string) => void;
  repositoryUUID?: string | null;
  pullRequestId?: number | null;
  onBlur?: (task: string, commentId?: string) => void;
};

type CreateTaskState = {
  createTaskErrorFieldId: string;
  isCreateTaskFocused: boolean;
  task: string;
};

class CreateTask extends PureComponent<CreateTaskProps, CreateTaskState> {
  taskRef: HTMLInputElement | null;

  static defaultProps = {
    kind: CreateTaskKind.Global,
  };

  constructor(props: CreateTaskProps) {
    super(props);
    this.state = {
      createTaskErrorFieldId: '',
      isCreateTaskFocused: false,
      task: props.initialTaskText || '',
    };
  }

  componentDidMount() {
    if (this.props.kind === CreateTaskKind.Comment && this.taskRef) {
      this.taskRef.focus();
    }
  }

  // @ts-ignore TODO: fix noImplicitAny error here
  componentDidUpdate(prevProps) {
    // clear the input upon successful task creation
    if (
      prevProps.isCreateTaskSubmitting &&
      !this.props.isCreateTaskSubmitting &&
      !this.props.createTaskHasError
    ) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ task: '' });

      // `this.taskRef.focus()` is a workaround to an issue where if you set
      // `isDisabled` on AK Textfield, the cursor does not get set into the
      // focused field properly anymore.
      if (this.taskRef) {
        this.taskRef.focus();
      }
    } else if (this.props.createTaskHasError) {
      if (this.taskRef) {
        this.taskRef.focus();
      }
    }
  }

  renderTaskStatus() {
    if (this.props.isCreateTaskSubmitting) {
      return (
        <styles.CreateTaskStatusWrapper>
          <Spinner size="small" />
        </styles.CreateTaskStatusWrapper>
      );
    }

    if (this.props.createTaskHasError) {
      return (
        <styles.CreateTaskStatusWrapper>
          <ErrorIcon label="error" primaryColor={colors.R400} />
        </styles.CreateTaskStatusWrapper>
      );
    }

    return null;
  }

  renderCreateTaskIcon(isCreateTaskFocused: boolean) {
    if (isCreateTaskFocused) {
      return (
        <CreateTaskIcon
          size={IconSizes.Small}
          label={this.props.intl.formatMessage(messages.createTask)}
          primaryColor={colors.N20}
        />
      );
    }

    return (
      <EditorAddIcon
        size="small"
        label={this.props.intl.formatMessage(messages.createTask)}
        primaryColor={colors.N60}
      />
    );
  }

  handleFocus() {
    this.toggleCreateTaskIcon(true);
  }

  handleBlur() {
    const { onBlur, commentId } = this.props;
    this.toggleCreateTaskIcon(false);
    if (onBlur) {
      onBlur(this.state.task, commentId);
    }
  }

  // @ts-ignore TODO: fix noImplicitAny error here
  toggleCreateTaskIcon(isFocused) {
    this.setState({ isCreateTaskFocused: !!isFocused });
  }

  handleSubmit = () => {
    const { task } = this.state;
    const { repositoryUUID, pullRequestId, commentId, kind } = this.props;
    const newTask = task.trim();
    if (newTask) {
      publishUiEvent({
        action: 'created',
        actionSubject: 'task',
        actionSubjectId: 'pullRequestTask',
        source: 'pullRequestScreen',
        objectType: 'pullRequest',
        objectId: `${repositoryUUID}/${pullRequestId}`,
        containerId: `${repositoryUUID}`,
        containerType: 'repository',
        attributes: {
          taskLocation: kind === CreateTaskKind.Comment ? 'comment' : 'sidebar',
        },
      });

      this.props.onTaskCreate(newTask, commentId);
    }
  };

  render() {
    const {
      createTaskErrorMessage,
      createTaskHasError,
      initialTaskText,
      intl,
      isCreateTaskSubmitting,
      canCreateTask,
    } = this.props;

    if (!canCreateTask) {
      return null;
    }

    const { createTaskErrorFieldId, isCreateTaskFocused, task } = this.state;

    return (
      <Fragment>
        <styles.CreateTaskContainer>
          <styles.CreateTaskIcon>
            {this.renderCreateTaskIcon(isCreateTaskFocused)}
          </styles.CreateTaskIcon>
          <styles.CreateTaskFormContainer isFocused={isCreateTaskFocused}>
            <Form onSubmit={this.handleSubmit}>
              {({ formProps }: any) => (
                <form {...formProps}>
                  <Field
                    name="createTask"
                    label=""
                    defaultValue={initialTaskText}
                  >
                    {({ fieldProps }: any) => {
                      // a11y (screen readers): since we're managing error states ourselves, make
                      // sure to set the ID of the error message container so that it
                      // maps to the values in `aria-labelledby` of the input with
                      // the error.
                      this.setState({
                        createTaskErrorFieldId: `${fieldProps.id}-error`,
                      });

                      return (
                        <Textfield
                          appearance="subtle"
                          autoComplete="off"
                          {...fieldProps}
                          placeholder={intl.formatMessage(messages.createTask)}
                          isCompact
                          isDisabled={isCreateTaskSubmitting}
                          isInvalid={createTaskHasError}
                          aria-invalid={createTaskHasError}
                          elemAfterInput={this.renderTaskStatus()}
                          onChange={(
                            e: React.ChangeEvent<HTMLInputElement>
                          ) => {
                            this.setState({ task: e.target.value });
                            // ensure pressing enter key still submits the form
                            fieldProps.onChange(e);
                          }}
                          onKeyUp={(
                            e: React.KeyboardEvent<HTMLInputElement>
                          ) => {
                            if (
                              this.taskRef &&
                              this.state.task.length === 0 &&
                              e.key === 'Escape'
                            ) {
                              this.taskRef.blur();
                            }
                          }}
                          onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                            this.handleBlur();
                            fieldProps.onBlur(e);
                          }}
                          onFocus={(e: React.FocusEvent<HTMLInputElement>) => {
                            this.handleFocus();
                            fieldProps.onFocus(e);
                          }}
                          // @ts-ignore TODO: fix noImplicitAny error here
                          ref={ref => {
                            this.taskRef = ref;
                          }}
                          value={task}
                        />
                      );
                    }}
                  </Field>
                </form>
              )}
            </Form>
          </styles.CreateTaskFormContainer>
        </styles.CreateTaskContainer>
        {createTaskHasError && (
          <styles.CreateTaskErrorMessage id={createTaskErrorFieldId}>
            {createTaskErrorMessage}
          </styles.CreateTaskErrorMessage>
        )}
      </Fragment>
    );
  }
}

export default injectIntl(CreateTask);
