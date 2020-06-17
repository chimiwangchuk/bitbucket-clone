export const REFINE_QUERY = 'search/REFINE_QUERY';

export default (item: { modifier?: string; operator?: string }) => {
  return {
    type: REFINE_QUERY,
    payload: {
      item,
    },
  };
};
