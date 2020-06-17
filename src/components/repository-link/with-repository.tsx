import React, { PureComponent, ComponentType } from 'react';

import { Repository } from 'src/components/types';

// @ts-ignore TODO: fix noImplicitAny error here
const getDisplayName = c => c.displayName || c.name || 'Component';

export const withRepository = (repository: Repository) => (
  Comp: ComponentType<any>
) =>
  class WithRepository extends PureComponent<any> {
    static WrappedComponent = Comp;
    static displayName = `WithRepository(${getDisplayName(Comp)})`;

    render() {
      return <Comp {...this.props} repository={repository} />;
    }
  };
