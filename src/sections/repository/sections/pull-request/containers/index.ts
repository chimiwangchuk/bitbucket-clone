import { defaultLoadable } from 'src/utils/loadable-configs';

export default defaultLoadable(() =>
  import(/* webpackChunkName: "pull-request" */ './page')
);
