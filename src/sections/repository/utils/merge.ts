import qs from 'qs';

import { delay } from 'src/utils/async';
import authRequest from 'src/utils/fetch';
import { MergeForm } from 'src/types/pull-request';
import urls from '../urls';

type MergeTask = {
  complete: boolean;
  conflicts?: boolean;
  error?: string[];
  task: string;
  url?: string;
};

export const MAX_POLL_TASK_INTERVAL = 1000 * 30; // ms
const POLL_TASK_INTERVAL = 1000 * 1; // ms

export async function pollMergeTask(
  taskUrl: string,
  interval: number
): Promise<MergeTask> {
  const response = await fetch(authRequest(taskUrl));

  if (!response.ok) {
    throw new Error();
  }

  const json = await response.json();

  if (json.error && !json.conflicts) {
    throw new Error(json.error);
  }

  if (json.complete) {
    return json;
  }

  const retryInterval = Math.min(MAX_POLL_TASK_INTERVAL, interval * 2);
  const retry = () => pollMergeTask(taskUrl, retryInterval);
  // @ts-ignore Return type doesn't consider retry logic?
  return delay(retry, interval);
}

export default async function merge(opts: {
  form: MergeForm;
  parentFullName: string;
  parentMainBranch: string;
  repositoryFullName: string;
  repositoryMainBranch: string;
}): Promise<MergeTask> {
  const data = {
    commit_message: opts.form.message,
    dest: `${opts.repositoryFullName}::${opts.repositoryMainBranch}`,
    source: `${opts.parentFullName}::${opts.parentMainBranch}`,
    tzoffset: `${-new Date().getTimezoneOffset()}`,
  };

  const response = await fetch(
    authRequest(urls.api.internal.compare(opts.repositoryFullName), {
      method: 'POST',
      body: qs.stringify(data),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
  );

  if (!response.ok) {
    throw new Error();
  }

  const taskInfo = await response.json();

  if (taskInfo.error) {
    throw new Error(taskInfo.error);
  }

  return pollMergeTask(taskInfo.url, POLL_TASK_INTERVAL);
}
