import * as defaultOptions from './defaults';
import { getActionTypes } from './getActionTypes';

function addInterceptor(target, candidate, injectedParameters) {
  if (!candidate) return;
  const successInterceptor = typeof candidate === 'function' ? candidate : candidate.success;
  const errorInterceptor = candidate && candidate.error;
  target.use(successInterceptor && successInterceptor.bind(null, injectedParameters),
    errorInterceptor && errorInterceptor.bind(null, injectedParameters));
}

function bindInterceptors(client, injectedParameters, middlewareInterceptors = {}, clientInterceptors = {}) {
  [...middlewareInterceptors.request || [], ...clientInterceptors.request || []].forEach((interceptor) => {
    addInterceptor(client.interceptors.request, interceptor, injectedParameters);
  });
  [...middlewareInterceptors.response || [], ...clientInterceptors.response || []].forEach((interceptor) => {
    addInterceptor(client.interceptors.response, interceptor, injectedParameters);
  });
}

export const multiClientMiddleware = (clients, customMiddlewareOptions) => {
  const middlewareOptions = { ...defaultOptions, ...customMiddlewareOptions };
  const initializedClients = {};
  let storedAction;
  return ({ getState, dispatch }) => next => action => {
    if (!middlewareOptions.isAxiosRequest(action)) {
      return next(action);
    }
    storedAction = action;
    const clientName = middlewareOptions.getClientName(action) || middlewareOptions.defaultClientName;
    if (!clients[clientName]) {
      throw new Error(`Client with name "${clientName}" has not been defined in middleware`);
    }
    if (!initializedClients[clientName]) {
      const clientOptions = { ...middlewareOptions, ...clients[clientName].options };
      if (clientOptions.interceptors) {
        const getAction = () => storedAction;
        const middlewareInterceptors = middlewareOptions.interceptors;
        const clientInterceptors = clients[clientName].options && clients[clientName].options.interceptors;
        const injectToInterceptor = { getState, dispatch, getAction };
        bindInterceptors(clients[clientName].client, injectToInterceptor, middlewareInterceptors, clientInterceptors);
      }
      initializedClients[clientName] = {
        client: clients[clientName].client,
        options: clientOptions
      };
    }
    const client = initializedClients[clientName];
    const actionOptions = { ...client.options, ...client.options.getRequestOptions(action) };
    const [REQUEST] = getActionTypes(action, actionOptions);
    next({ ...action, type: REQUEST });
    return client.client.request(actionOptions.getRequestConfig(action))
      .then(
        (response) => {
          const newAction = actionOptions.onSuccess({ action, next, response, getState, dispatch }, actionOptions);
          actionOptions.onComplete({ action: newAction, next, getState, dispatch }, actionOptions);
          return newAction;
        },
        (error) => {
          const newAction = actionOptions.onError({ action, next, error, getState, dispatch }, actionOptions);
          actionOptions.onComplete({ action: newAction, next, getState, dispatch }, actionOptions);
          return actionOptions.returnRejectedPromiseOnError ? Promise.reject(newAction) : newAction;
        });
  };
};

export default (client, customMiddlewareOptions, customClientOptions) => {
  const middlewareOptions = { ...defaultOptions, ...customMiddlewareOptions };
  const options = customClientOptions || {};
  return multiClientMiddleware({ [middlewareOptions.defaultClientName]: { client, options } }, middlewareOptions);
};
