import * as defaultOptions from './defaults';
import { getActionTypes } from './getActionTypes';

export default (client, userOptions = {}) => {
  const options = { ...defaultOptions, ...userOptions };
  return ({ getState, dispatch }) => next => action => {
    if (!options.isAxiosRequest(action)) {
      return next(action);
    }
    const [REQUEST] = getActionTypes(action, options);
    next({ ...action, type: REQUEST });
    return client.request(options.getRequestConfig(action)).then((response) => {
      const newAction = options.onSuccess({ action, next, response, getState, dispatch }, options);
      options.onComplete({ action: newAction, next, getState, dispatch }, options);
    }, (error) => {
      if (error instanceof Error) {
        next({ type: 'redux-axios-middleware/FATAL_ERROR', error, meta: action });
        console.log('clientMiddleware axios error', error);
      } else {
        const newAction = options.onError({ action, next, error, getState, dispatch }, options);
        options.onComplete({ action: newAction, next, getState, dispatch }, options);
      }
    });
  };
};
