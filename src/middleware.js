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

function getSourceAction(config) {
  return config.reduxSourceAction;
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
        const middlewareInterceptors = middlewareOptions.interceptors;
        const clientInterceptors = clients[clientName].options && clients[clientName].options.interceptors;
        const injectToInterceptor = { getState, dispatch, getSourceAction };
        bindInterceptors(clients[clientName].client, injectToInterceptor, middlewareInterceptors, clientInterceptors);
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

    const requestConfig = {
      ...actionOptions.getRequestConfig(action),
      reduxSourceAction: action
    };
    return setupedClient.client.request(requestConfig)
      .then(
        (response) => {
          const newAction = actionOptions.onSuccess({ action, next, response, getState, dispatch }, actionOptions);
          actionOptions.onComplete({ action: newAction, next, getState, dispatch }, actionOptions);
          return newAction;
        },
        (error) => {
          let newAction;
          if (middlewareOptions.isCancel(error)) {
            newAction = actionOptions.onCancel({ action, next, error, getState, dispatch }, actionOptions);
          } else {
            newAction = actionOptions.onError({ action, next, error, getState, dispatch }, actionOptions);
          }
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
