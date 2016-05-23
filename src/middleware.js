import * as defaultOptions from './defaults';
import { getActionTypes } from './getActionTypes';

let interceptorsBound = false;
function bindInterceptors(client, getState, { request = [], response = [] } = {}) {
  request.forEach((interceptor) => {
    client.interceptors.request.use(interceptor.bind(null, getState));
  });
  response.forEach((interceptor) => {
    client.interceptors.response.use(interceptor.bind(null, getState));
  });
  interceptorsBound = true;
}

export default (client, userOptions = {}) => {
  const options = { ...defaultOptions, ...userOptions };
  return ({ getState, dispatch }) => next => action => {
    if (!options.isAxiosRequest(action)) {
      return next(action);
    }
    if (options.interceptors && !interceptorsBound) {
      bindInterceptors(client, getState, options.interceptors);
    }
    const [REQUEST] = getActionTypes(action, options);
    next({ ...action, type: REQUEST });
    return client.request(options.getRequestConfig(action))
      .then(
        (response) => {
          const newAction = options.onSuccess({ action, next, response, getState, dispatch }, options);
          options.onComplete({ action: newAction, next, getState, dispatch }, options);
          return newAction;
        },
        (error) => {
          const newAction = options.onError({ action, next, error, getState, dispatch }, options);
          options.onComplete({ action: newAction, next, getState, dispatch }, options);
          return options.returnRejectedPromiseOnError ? Promise.reject(newAction) : newAction;
        });
  };
};
