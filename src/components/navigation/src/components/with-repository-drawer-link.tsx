import React, { Component, ComponentType } from 'react';
import { RepositoryGlobalSearchResult } from '../types';

type Props = {
  isSearchDrawerOpen: boolean;
  onSearchDrawerClose: () => void;
};

// @ts-ignore TODO: fix noImplicitAny error here
const getDisplayName = c => c.displayName || c.name || 'Component';

const isRepository = (
  repoResult: BB.Repository | RepositoryGlobalSearchResult
): repoResult is BB.Repository => {
  return repoResult && 'links' in repoResult && repoResult.links !== undefined;
};

export const makeRepositoryDrawerLink = (
  repoResult: BB.Repository | RepositoryGlobalSearchResult,
  selectData: Props
) => (Comp: ComponentType<any>) => {
  return class RepositoryDrawerLink extends Component<any> {
    static WrappedComponent = Comp;
    static displayName = `RepositoryDrawerLink(${getDisplayName(Comp)})`;

    onClick = (event: MouseEvent) => {
      if (this.props.onClick) {
        this.props.onClick(event);
      }

      if (selectData.isSearchDrawerOpen) {
        selectData.onSearchDrawerClose();
      }
    };

    render() {
      return (
        <Comp
          {...this.props}
          repository={
            isRepository(repoResult)
              ? repoResult
              : {
                  ...repoResult,
                  full_name: repoResult.fullSlug,
                  links: {
                    html: {
                      href: repoResult.url,
                    },
                  },
                }
          }
          onClick={this.onClick}
        />
      );
    }
  };
};
