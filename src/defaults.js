import { getActionTypes } from './getActionTypes';

export const returnRejectedPromiseOnError = false;

export const defaultClientName = 'default';

export const isAxiosRequest = action => action.payload && action.payload.request;

export const isCancel = value => !!(value && value.__CANCEL__);

export const getRequestConfig = action => action.payload.request;

export const getClientName = action => action.payload.client;

export const getRequestOptions = action => action.payload.options;

export const onSuccess = ({ action, next, response }, options) => {
  const nextAction = {
    type: getActionTypes(action, options)[1],
    payload: response,
    meta: {
      previousAction: action
    }
  };
  next(nextAction);
  return nextAction;
};

export const onCancel = ({ action, next, error }, options) => {
  const nextAction = {
    type: getActionTypes(action, options)[3],
    error: {
      data: error.message,
      status: 0
    },
    cancelled: true,
    meta: {
      previousAction: action
    }
  };

  next(nextAction);
  return nextAction;
};

export const onError = ({ action, next, error }, options) => {
  let errorObject;

  if (!error.response) {
    errorObject = {
      data: error.message,
      status: 0
    };
    if (process.env.NODE_ENV !== 'production') {
      console.log('HTTP Failure in Axios', error);
    }
  } else {
    errorObject = error;
  }

  const nextAction = {
    type: getActionTypes(action, options)[2],
    error: errorObject,
    meta: {
      previousAction: action
    }
  };

  next(nextAction);
  return nextAction;
};

export const onComplete = () => {};
