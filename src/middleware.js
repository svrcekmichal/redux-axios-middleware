import * as defaultOptions from './defaults';
import { getActionTypes } from './helpers';

export default (client, options = {}) => {
  const { onSuccess, onError, onComplete } = { ...defaultOptions, ...options };

  return ({ getState, dispatch }) => next => action => {
    if (!action.payload || !action.payload.request) {
      return next(action);
    }

    const [REQUEST] = getActionTypes(action);
    next({ ...action, type: REQUEST });

    return client.request(action.payload.request).then((response) => {
      const newAction = onSuccess({ action, next, response, getState, dispatch });
      onComplete({ action: newAction, next, getState, dispatch });
    }, (error) => {
      const newAction = onError({ action, next, error, getState, dispatch });
      onComplete({ action: newAction, next, getState, dispatch });
    });
  };
};
