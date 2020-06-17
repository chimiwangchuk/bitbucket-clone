import { MenuItem } from 'src/components/navigation';
import { User, Workspace, Team } from 'src/components/types';

export type ProfileSectionState = {
  menuItems: MenuItem[];
  currentUser: User | Team | undefined;
  currentWorkspace: Workspace | undefined;
  activeMenuItem: string;
};

export function isTeam(
  currentUser: User | Team | undefined
): currentUser is Team {
  return (currentUser as Team).type === 'team';
}
