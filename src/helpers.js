export const getActionTypes = (action) => {
  let types;
  if (typeof action.type !== 'undefined') {
    const { type } = action;
    types = [type, `${type}_SUCCESS`, `${type}_FAIL`];
  } else {
    types = action.types;
  }
  return types;
};
