import { TOGGLE_SYNC_DIALOG } from './';

export type ToggleSyncDialogAction = {
  type: 'repository/TOGGLE_SYNC_DIALOG';
  payload: boolean;
};

export default (isOpen: boolean): ToggleSyncDialogAction => ({
  type: TOGGLE_SYNC_DIALOG,
  payload: isOpen,
});
