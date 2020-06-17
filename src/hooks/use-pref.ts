import * as Sentry from '@sentry/browser';
import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { getCurrentUser } from 'src/selectors/user-selectors';
import prefs, { PreferenceKey } from 'src/utils/preferences';
import { useObjectState } from './use-object-state';

type State = {
  value?: string;
  isLoading: boolean;
};

export function usePref(
  key: PreferenceKey
): [string | undefined, (pref?: string) => Promise<void>, boolean] {
  const [state, setState] = useObjectState<State>({ isLoading: true });
  const currentUser = useSelector(getCurrentUser);
  const mounted = useRef(true);

  useEffect(() => {
    (async () => {
      try {
        if (currentUser) {
          const value = await prefs.get(currentUser.uuid, key);
          if (mounted.current) {
            setState({ value, isLoading: false });
          }
        }
      } catch (e) {
        Sentry.captureException(e);
      }
    })();
    return () => {
      mounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser && currentUser.uuid]);

  async function update(pref?: string) {
    try {
      if (!currentUser) {
        return;
      }
      if (mounted.current) {
        setState({ isLoading: true });
      }
      if (pref === undefined) {
        await prefs.delete(currentUser.uuid, key);
      } else {
        await prefs.set(currentUser.uuid, key, pref);
      }
      if (mounted.current) {
        setState({ value: pref, isLoading: false });
      }
    } catch (e) {
      Sentry.captureException(e);
    }
  }

  return [state.value, update, state.isLoading];
}
