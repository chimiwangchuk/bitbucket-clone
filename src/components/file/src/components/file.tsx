import React, { Component } from 'react';
import FileStateless, { FileStatelessProps } from './file-stateless';

export type FileProps = FileStatelessProps & {
  isInitiallyExpanded: boolean;
};

type State = {
  isExpanded: boolean;
};

class File extends Component<FileProps, State> {
  static defaultProps = {
    isInitiallyExpanded: true,
  };

  state = {
    isExpanded: this.props.isInitiallyExpanded,
  };

  handleExpand = () => {
    this.setState(state => ({ isExpanded: !state.isExpanded }));
  };

  render() {
    const { children, ...props } = this.props;
    return (
      <FileStateless
        {...props}
        isExpanded={this.state.isExpanded}
        toggleExpanded={this.handleExpand}
      >
        {children}
      </FileStateless>
    );
  }
}

export default File;
