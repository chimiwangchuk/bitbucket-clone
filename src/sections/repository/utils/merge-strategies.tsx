import { InjectedIntl } from 'react-intl';
import { OptionType } from '@atlaskit/select';
import memoize from 'memoize-one';
import { MergeStrategy } from 'src/types/pull-request';
import messages from './merge-strategies.i18n';

export type MergeStrategyOption = OptionType & {
  description: string;
  value: MergeStrategy;
};

const getStrategy = (
  strategy: MergeStrategy,
  intl: InjectedIntl
): MergeStrategyOption | undefined => {
  switch (strategy) {
    case MergeStrategy.MergeCommit:
      return {
        label: intl.formatMessage(messages.mergeCommit),
        value: MergeStrategy.MergeCommit,
        description: 'git merge --no-ff',
      };
    case MergeStrategy.Squash:
      return {
        label: intl.formatMessage(messages.squash),
        value: MergeStrategy.Squash,
        description: 'git merge --squash',
      };
    case MergeStrategy.FastForward:
      return {
        label: intl.formatMessage(messages.fastForward),
        value: MergeStrategy.FastForward,
        description: 'git merge --ff-only',
      };
    default:
      return undefined;
  }
};

export const getMergeStrategyOption = memoize(getStrategy);
