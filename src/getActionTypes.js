export const SUCCESS_SUFFIX = '_SUCCESS';
export const ERROR_SUFFIX = '_FAIL';
export const CANCEL_SUFFIX = '_CANCEL';

export const getActionTypes = (action, {
  errorSuffix = ERROR_SUFFIX,
  successSuffix = SUCCESS_SUFFIX,
  cancelSuffix = CANCEL_SUFFIX,
} = {}) => {
  let types;
  if (typeof action.type !== 'undefined') {
    const { type } = action;
    types = [type, `${type}${successSuffix}`, `${type}${errorSuffix}`, `${type}${cancelSuffix}`];
  } else if (typeof action.types !== 'undefined') {
    types = action.types;
  } else {
    throw new Error('Action which matched axios middleware needs to have "type" or "types" key which is not null');
  }
  return types;
};
