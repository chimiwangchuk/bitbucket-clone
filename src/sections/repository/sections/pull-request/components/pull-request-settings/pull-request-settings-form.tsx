import React, { useCallback, useContext, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  DiffViewMode,
  getGlobalDiffViewMode,
  getGlobalIsColorBlindModeEnabled,
  getGlobalIsWordDiffEnabled,
  getGlobalShouldIgnoreWhitespace,
  updateSettings,
  getGlobalIsAnnotationsEnabled,
} from 'src/redux/pull-request-settings';
import { BucketState } from 'src/types/state';

type FormState = {
  diffViewMode: DiffViewMode;
  isWordDiffEnabled: boolean;
  shouldIgnoreWhitespace: boolean;
  isColorBlindModeEnabled: boolean;
  isAnnotationsEnabled: boolean;
};

type FormContext =
  // this is the return value for `useState<FormState>()`
  [FormState, React.Dispatch<React.SetStateAction<FormState>>] | undefined;

const PullRequestSettingsFormContext = React.createContext<FormContext>(
  undefined
);

export const usePullRequestSettingsForm = () => {
  const context = useContext(PullRequestSettingsFormContext);
  if (context === undefined) {
    throw new Error(
      '`usePullRequestSettingsForm` must be used within a `PullRequestSettingsFormContext.Provider`'
    );
  }
  return context;
};

type Props = {
  children: React.ReactNode;
};

export const PullRequestSettingsForm = React.memo((props: Props) => {
  const { children, ...otherProps } = props;

  const dispatch = useDispatch();

  const globalDiffViewMode = useSelector<BucketState, DiffViewMode>(
    getGlobalDiffViewMode
  );

  const globalIsWordDiffEnabled = useSelector<BucketState, boolean>(
    getGlobalIsWordDiffEnabled
  );

  const globalShouldIgnoreWhitespace = useSelector<BucketState, boolean>(
    getGlobalShouldIgnoreWhitespace
  );

  const globalIsColorBlindModeEnabled = useSelector<BucketState, boolean>(
    getGlobalIsColorBlindModeEnabled
  );

  const globalIsAnnotationsEnabled = useSelector<BucketState, boolean>(
    getGlobalIsAnnotationsEnabled
  );

  const formStateConfig = useState<FormState>({
    diffViewMode: globalDiffViewMode,
    isWordDiffEnabled: globalIsWordDiffEnabled,
    shouldIgnoreWhitespace: globalShouldIgnoreWhitespace,
    isColorBlindModeEnabled: globalIsColorBlindModeEnabled,
    isAnnotationsEnabled: globalIsAnnotationsEnabled,
  });

  const [formState] = formStateConfig;

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      dispatch(
        updateSettings({
          diffViewMode: formState.diffViewMode,
          isWordDiffEnabled: formState.isWordDiffEnabled,
          shouldIgnoreWhitespace: formState.shouldIgnoreWhitespace,
          isColorBlindModeEnabled: formState.isColorBlindModeEnabled,
          isAnnotationsEnabled: formState.isAnnotationsEnabled,
        })
      );
    },
    [dispatch, formState]
  );

  return (
    <PullRequestSettingsFormContext.Provider value={formStateConfig}>
      <form {...otherProps} onSubmit={handleSubmit}>
        {children}
      </form>
    </PullRequestSettingsFormContext.Provider>
  );
});
