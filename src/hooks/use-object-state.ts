import { useState } from 'react';

export type NextState<T> = Partial<T> | ((prevState: T) => Partial<T>);

export const useObjectState = <T>(
  initialState: T,
  beforeUpdate: (nextState: T) => T = nextState => nextState
): [T, (nextState: NextState<T>) => void] => {
  const [state, setState] = useState(initialState);
  const setNextState = (nextState: NextState<T>) =>
    setState((prevState: T) =>
      beforeUpdate(
        Object.assign(
          {},
          prevState,
          typeof nextState === 'function' ? nextState(prevState) : nextState
        )
      )
    );
  return [state, setNextState];
};
