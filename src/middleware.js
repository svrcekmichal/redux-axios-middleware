import * as defaultOptions from './defaults';
import { getActionTypes } from './getActionTypes';

function addInterceptor(target, candidate, getState) {
  if (!candidate) return;
  const successInterceptor = typeof candidate === 'function' ? candidate : candidate.success;
  const errorInterceptor = candidate && candidate.error;
  target.use(successInterceptor && successInterceptor.bind(null, getState),
    errorInterceptor && errorInterceptor.bind(null, getState));
}

function bindInterceptors(client, getState, middlewareInterceptors = {}, clientInterceptors = {}) {
  [...middlewareInterceptors.request || [], ...clientInterceptors.request || []].forEach((interceptor) => {
    addInterceptor(client.interceptors.request, interceptor, getState);
  });
  [...middlewareInterceptors.response || [], ...clientInterceptors.response || []].forEach((interceptor) => {
    addInterceptor(client.interceptors.response, interceptor, getState);
  });
}

export const multiClientMiddleware = (clients, customMiddlewareOptions) => {
  const middlewareOptions = { ...defaultOptions, ...customMiddlewareOptions };
  const setupedClients = {};
  return function ({ getState, dispatch }) {
    const enhancedGetState = function () {
      console.log(`
       Warning, getState as function in interceptor will be removed in version 2 of middleware.
       Stop: interceptor(getState,config) { ... }
       Do: interceptor({getState}, config) { ... }
      `);
      return getState();
    };
    enhancedGetState.getState = getState;
    enhancedGetState.dispatch = dispatch;
    return next => action => {
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
          enhancedGetState.action = action;
          bindInterceptors(clients[clientName].client, enhancedGetState,
            middlewareOptions.interceptors, clients[clientName].options.interceptors);
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
};

export default (client, customMiddlewareOptions, customClientOptions) => {
  const middlewareOptions = { ...defaultOptions, ...customMiddlewareOptions };
  const options = customClientOptions || {};
  return multiClientMiddleware({ [middlewareOptions.defaultClientName]: { client, options } }, middlewareOptions);
};
