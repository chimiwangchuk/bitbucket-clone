import { hiddenLoadable } from 'src/utils/loadable-configs';

// lazy loading spotlight, since it increases bundle size by ~500kb
const LazySpotlight = hiddenLoadable(() =>
  import(
    /* webpackChunkName: "pr-welcome-tour-spotlight" */ 'src/sections/repository/sections/pull-request/components/welcome-dialog/spotlight'
  )
);

export default LazySpotlight;
