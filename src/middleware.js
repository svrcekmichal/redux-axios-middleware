import * as defaultOptions from './defaults';
import { getActionTypes } from './getActionTypes';

function addInterceptors(target, candidate, getState) {
  const successInterceptor = candidate ? (candidate.success || candidate).bind(null, getState) : null;
  const failureInterceptor = candidate && candidate.failure ? candidate.failure.bind(null, getState) : null;
  target.use(successInterceptor, failureInterceptor);
}

function bindInterceptors(client, getState, middlewareInterceptors = {}, clientInterceptors = {}) {
  [...middlewareInterceptors.request || [], ...clientInterceptors.request || []].forEach((interceptor) => {
    addInterceptors(client.interceptors.request, interceptor, getState);
  });
  [...middlewareInterceptors.response || [], ...clientInterceptors.response || []].forEach((interceptor) => {
    addInterceptors(client.interceptors.response, interceptor, getState);
  });
}

export const multiClientMiddleware = (clients, customMiddlewareOptions) => {
  const middlewareOptions = { ...defaultOptions, ...customMiddlewareOptions };
  const setupedClients = {};
  return ({ getState, dispatch }) => next => action => {
    if (!middlewareOptions.isAxiosRequest(action)) {
      return next(action);
    }
    const clientName = middlewareOptions.getClientName(action) || middlewareOptions.defaultClientName;
    if (!clients[clientName]) {
      throw new Error(`Client with name "${clientName}" has not been defined in middleware`);
    }
    if (!setupedClients[clientName]) {
      const clientOptions = { ...middlewareOptions, ...clients[clientName].options };
      if (clientOptions.interceptors) {
        bindInterceptors(clients[clientName].client, getState, middlewareOptions.interceptors, clients[clientName].options.interceptors);
      }
      setupedClients[clientName] = {
        client: clients[clientName].client,
        options: clientOptions
      };
    }
    const setupedClient = setupedClients[clientName];
    const actionOptions = { ...setupedClient.options, ...setupedClient.options.getRequestOptions(action) };
    const [REQUEST] = getActionTypes(action, actionOptions);
    next({ ...action, type: REQUEST });
    return setupedClient.client.request(actionOptions.getRequestConfig(action))
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
