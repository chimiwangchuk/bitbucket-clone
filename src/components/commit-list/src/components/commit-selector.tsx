import React, { PureComponent } from 'react';
import { Commit as CommitType } from 'src/components/types';
import CommitList from './commit-list';

type CommitListProps = JSX.LibraryManagedAttributes<
  typeof CommitList,
  CommitList['props']
>;

type CommitSelectorProps = CommitListProps & {
  commits: CommitType[]; // this is not being picked up as non-optional from `CommitListProps` for some reason
  onCommitRangeChange: (
    selectedCommitRangeStart: string | undefined,
    selectedCommitRangeEnd: string
  ) => void;
};

type CommitSelectorState = {
  selectedCommitRangeStart?: string;
  selectedCommitRangeEnd: string;
};

export default class CommitSelector extends PureComponent<
  CommitSelectorProps,
  CommitSelectorState
> {
  static defaultProps = {
    commits: [],
    hasMore: false,
    isLoading: false,
    mergeBaseHash: '',
    onCommitRangeChange: () => {},
    onShowMoreClick: () => {},
    showCommitSelector: true,
  };

  state = {
    selectedCommitRangeStart: this.props.mergeBaseHash,
    selectedCommitRangeEnd: this.props.commits[0]
      ? this.props.commits[0].hash
      : '',
  };

  handleCommitChange = (
    selectedCommitRangeStart: string,
    selectedCommitRangeEnd: string
  ): void => {
    this.setState({
      selectedCommitRangeStart,
      selectedCommitRangeEnd,
    });

    this.props.onCommitRangeChange(
      selectedCommitRangeStart,
      selectedCommitRangeEnd
    );
  };

  render() {
    const { onCommitRangeChange, ...commitListProps } = this.props;

    return (
      <CommitList
        handleCommitChange={this.handleCommitChange}
        selectedCommitRangeStart={this.state.selectedCommitRangeStart}
        selectedCommitRangeEnd={this.state.selectedCommitRangeEnd}
        {...commitListProps}
      />
    );
  }
}
