import { hiddenLoadable } from 'src/utils/loadable-configs';

export default hiddenLoadable(() =>
  import(/* webpackChunkName: "code-insights" */ './code-insights')
);
