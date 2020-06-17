import { defineMessages } from 'react-intl';

export default defineMessages({
  label: {
    id: 'frontbucket.repository.pullrequest.tasksCardLabel',
    description: 'Label for a sidebar card showing a list of tasks.',
    defaultMessage: 'Tasks',
  },
  taskCounts: {
    id: 'frontbucket.repository.pullrequest.tasksCount',
    description: 'N of M task counts in the current pull request',
    defaultMessage:
      '{totalTaskCount, plural, =0 {0} other {{resolvedTaskCount} of {totalTaskCount}}}',
  },
  tasksCompleted: {
    id: 'frontbucket.repository.pullrequest.tasksCompleted',
    description: 'tasks completed in the current pull request',
    defaultMessage:
      '{totalTaskCount, plural, =0 {tasks} one {task resolved} other {tasks resolved}}',
  },
  errorHeading: {
    id: 'frontbucket.repository.pullrequest.tasks.errorHeading',
    description:
      'Text for error state showing that there was a problem loading tasks',
    defaultMessage: `Couldn't load tasks`,
  },
  editTasksButtonText: {
    id: 'frontbucket.repository.pullrequest.tasks.editTasksButtonText',
    description:
      'The text for the button that puts the tasks sidebar card in edit mode',
    defaultMessage: 'Edit tasks',
  },
  deleteTaskLabel: {
    id: 'frontbucket.repository.pullrequest.tasks.deleteButtonLabel',
    description: 'Label for a button which deletes a task when clicked.',
    defaultMessage: 'Delete',
  },
  linkToTaskComment: {
    id: 'frontbucket.repository.pullrequest.tasks.linkToTaskComment',
    description:
      'Accessible link text which takes the user to the comment associated with a task.',
    defaultMessage: 'Go to comment',
  },
  editTaskLabel: {
    id: 'frontbucket.repository.pullrequest.tasks.editButtonLabel',
    description:
      'Label for a button which initiates editing a task when clicked.',
    defaultMessage: 'Edit',
  },
  cancelEditTaskLabel: {
    id: 'frontbucket.repository.pullrequest.tasks.cancelEditTaskLabel',
    description: 'Label for a button which cancels the editing of a task.',
    defaultMessage: 'Cancel',
  },
  saveEditTaskLabel: {
    id: 'frontbucket.repository.pullrequest.tasks.saveEditTaskLabel',
    description: 'Label for a button which saves the edited value of a task.',
    defaultMessage: 'Save',
  },
});
