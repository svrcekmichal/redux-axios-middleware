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

const requests = {};

export const multiClientMiddleware = (clients, customMiddlewareOptions) => {
  const middlewareOptions = { ...defaultOptions, ...customMiddlewareOptions };
  const setupedClients = {};
  let actionRequestId = null;
  return ({ getState, dispatch }) => next => action => {
    if (!middlewareOptions.isAxiosRequest(action)) {
      return next(action);
    }

    if (action.payload.cancellable) {
      const requestId = typeof requests[action.type] !== 'undefined' ? requests[action.type] + 1 : 1;
      actionRequestId = requestId;
      requests[action.type] = requestId;
    }

    const clientName = middlewareOptions.getClientName(action) || middlewareOptions.defaultClientName;
    if (!clients[clientName]) {
      throw new Error(`Client with name "${clientName}" has not been defined in middleware`);
    }
    if (!setupedClients[clientName]) {
      const clientOptions = { ...middlewareOptions, ...clients[clientName].options };
      if (clientOptions.interceptors) {
        bindInterceptors(clients[clientName].client, { getState, dispatch, action },
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
          if (action.payload.cancellable) {
            if (actionRequestId !== requests[action.type]) {
              if (process && process.env && process.env.NODE_ENV === 'development') {
                return console.info(`Action ${action.type} cancelled`);
              }

              return false;
            }
          }
          const newAction = actionOptions.onSuccess({ action, next, response, getState, dispatch }, actionOptions);
          actionOptions.onComplete({ action: newAction, next, getState, dispatch }, actionOptions);
          return newAction;
        },
        (error) => {
          if (action.payload.cancellable) {
            if (actionRequestId !== requests[action.type]) {
              if (process && process.env && process.env.NODE_ENV === 'development') {
                return console.info(`Action ${action.type} cancelled`);
              }

              return false;
            }
          }
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
