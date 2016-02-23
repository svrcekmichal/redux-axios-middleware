import { getActionTypes } from './helpers';

export const onSuccess = ({ action, next, response }) => {
  const nextAction = {
    ...action,
    payload: { ...action.payload, response },
    type: getActionTypes(action)[1]
  };

  next(nextAction);
  return nextAction;
};

export const onError = ({ action, next, error }) => {
  if (error instanceof Error) {
    console.log('clientMiddleware axios error', error);
  }

  const { payload, ...rest } = action; // eslint-disable-line no-use-before-define
  const nextAction = {
    ...rest,
    error: { ...action.payload, error },
    type: getActionTypes(action)[2]
  };

  next(nextAction);
  return nextAction;
};

export const onComplete = () => {};
