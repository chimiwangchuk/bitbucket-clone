import { defaultLoadable } from 'src/utils/loadable-configs';

export default defaultLoadable(() =>
  import(/* webpackChunkName: "commit-list" */ './route')
);
