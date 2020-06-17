import { BuildStatus } from 'src/components/types';

export function getBuildStatuses(buildsArray: BuildStatus[]) {
  const initialStatuses = {
    FAILED: 0,
    INPROGRESS: 0,
    STOPPED: 0,
    SUCCESSFUL: 0,
  };

  return buildsArray.reduce((acc, build) => {
    acc[build.state] += 1;

    return acc;
  }, initialStatuses);
}
