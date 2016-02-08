import * as defaultOptions from './defaults';

export default (options) => ({getState,dispatch}) => next => action => {
  const {client,onSuccess,onError,onComplete} = {...defaultOptions,...options};

  if(!action.payload || !action.payload.request) {
    return next(action);
  }

  const [REQUEST] = getActionTypes(action);
  next({...action, type:REQUEST});

  return client.request(action.payload.request).then((response) => {
    const newAction = onSuccess({action,next, response,getState,dispatch});
    return onComplete({action:newAction,next, getState,dispatch});
  }, (error) => {
    const newAction = onError({action,next,error,getState,dispatch});
    return onComplete({action:newAction,next, getState,dispatch});
  });
}
