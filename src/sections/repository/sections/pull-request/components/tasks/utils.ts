import { Task } from 'src/components/types';

export const taskKey = (task: Task | number | string) =>
  `task-${
    typeof task === 'number' || typeof task === 'string' ? task : task.id
  }`;
