import { RepositoryPrivilege } from 'src/sections/repository/types';

type AccessParams = {
  userLevel: RepositoryPrivilege | null | undefined;
  requiredLevel: RepositoryPrivilege;
};

export const checkUserAccess = (access: AccessParams) => {
  switch (access.userLevel) {
    case 'read':
      return access.requiredLevel === 'read';
    case 'write':
      return ['read', 'write'].includes(access.requiredLevel);
    case 'admin':
      return true;
    default:
      return false;
  }
};
