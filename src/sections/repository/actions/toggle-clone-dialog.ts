import { TOGGLE_CLONE_DIALOG } from './';

type ToggleCloneDialogPayload = boolean;

export type ToggleCloneDialogAction = {
  type: 'repository/TOGGLE_CLONE_DIALOG';
  payload: ToggleCloneDialogPayload;
};

export default (isOpen: ToggleCloneDialogPayload): ToggleCloneDialogAction => ({
  type: TOGGLE_CLONE_DIALOG,
  payload: isOpen,
});
