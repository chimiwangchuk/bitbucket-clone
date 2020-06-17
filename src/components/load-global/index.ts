import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import loadGlobal from '../../redux/global/actions/load-global';
import { HYDRATE_FROM_LOCALSTORAGE } from '../../redux/global/actions';

// @ts-ignore TODO: fix noImplicitAny error here
export const LoadGlobal = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadGlobal());
    dispatch({ type: HYDRATE_FROM_LOCALSTORAGE });
  }, [dispatch]);

  return children;
};
