import { getActionTypes } from './getActionTypes';

export const isAxiosRequest = action => action.payload && action.payload.request;

export const getRequestConfig = action => action.payload.request;

export const onSuccess = ({ action, next, response }, options) => {
  const { data, ...responseMeta } = response; // eslint-disable-line no-use-before-define
  const { payload: requestPayload, meta: requestMeta = {}, ...restOfAction } = action; // eslint-disable-line no-use-before-define

  const nextAction = {
    ...restOfAction,
    payload: data,
    meta: {
      response: responseMeta,
      ...requestPayload,
      ...requestMeta
    },
    type: getActionTypes(action, options)[1]
  };

  next(nextAction);
  return nextAction;
};

export const onError = ({ action, next, error }, options) => {
  const { payload: requestPayload, meta: requestMeta, ...restOfAction } = action; // eslint-disable-line no-use-before-define
  const { data, ...restOfError } = error; // eslint-disable-line no-use-before-define
  const nextAction = {
    ...restOfAction,
    error: data,
    meta: {
      response: restOfError,
      ...requestPayload,
      ...requestMeta
    },
    type: getActionTypes(action, options)[2]
  };

  next(nextAction);
  return nextAction;
};

export const onComplete = () => {
};
