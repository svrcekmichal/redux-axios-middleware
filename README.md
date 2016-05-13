# redux-axios-middleware

Redux middleware for fetching data with axios HTTP client

## Installation

```bash
npm i -S redux-axios-middleware
```

## How to use?

### Use middleware

By default you only need to import middleware from package and add it to redux middlewares
and execute it with first aargument being with axios instance. second optional argument are middleware
options for customizing

```js
import {createStore, applyMiddleware} from 'redux';
import axios from 'axios';
import axiosMiddleware from 'redux-axios-middleware';

const client = axios.create({ //all axios can be used, shown in axios documentation
  baseURL:'http://localhost:8080/api',
  responseType: 'json'
});

let store = createStore(
  reducers, //custom reducers
  applyMiddleware(
    //all middlewares
    ...
    axiosMiddleware(client), //second parameter options can optionally contain onSuccess, onError, onComplete, successSuffix, errorSuffix
    ...
  )
)
```

### Dispatch action

Every action which have `payload.request` defined will be handled by middleware. There are two possible type
definitions.

- use `action.type` with string name
action with type will be dispatched on start, and then followed by type suffixed with underscore and
success suffix on success, or error suffix on error

defaults: success suffix = "_SUCCESS" error suffix = "_FAIL"

```javascript
export function loadCategories() {
  return {
    type: 'LOAD',
    payload: {
      request:{
        url:'/categories'
      }
    }
  }
}
```

- use `action.types` with array of types `[REQUEST,SUCCESS,FAILURE]`
`REQUEST` will be dispatched on start, then `SUCCESS` or `FAILURE` after request result

```javascript
export function loadCategories() {
  return {
    types: ['LOAD','AWESOME','OH_NO'],
    payload: {
      request:{
        url:'/categories'
      }
    }
  }
}
```

Actions that are handled by this middleware return a promise.  This gives you the ability to chain actions.  A good example of this might be a form.  In the form you might dispatch an actions to store the form values.  The normal flow of the action into the reducers would not be altered but you can chain a then/catch onto the initial dispatch.

```javascript
this.props.saveForm(formData)
  .then(() => {
    // router the user away
    this.context.router.push("/my/home/page")
  })
  .catch((response) => {
    //handle form errors
  })
```

Another example might be a set of actions that you want dispatched together.

```javascript
Promise.all([
  dispatch(foo()),
  dispatch(bar()),
  dispatch(bam()),
  dispatch(boom())

]).then(() => {
  dispatch(
    loginSuccess(
      token
    )
  )
})
```

### Next middleware

By default next middleware will receive new action object:

#### on success

```javascript
{
  type: 'AWESOME', //success type
  payload: [1,2,3] //data from response
  meta: {
    request:{
      url:'/categories' //whole reqquest from payload
    },
    response: {
      // ... axios response object without data
      status:200,
      statusTest:'OK',
      headers: {},
      config: {}
    },
    // all meta keys
  }
}
```

#### on error

Error action is same as success action with one difference, there's no key `payload`, but now there's `error`;

```js
{
    type:'OH_NO',
    error:['Error1', 'Error2'] //data from axios response error
    // ... same as success
}
```

#### if axios failed fataly

```js
{
   type:'redux-axios-middleware/FATAL_ERROR',
   error: Error, // instance of error,
   meta: ActionObject // action which fataled
}
```

### Middleware options

When adding middleware to redux you can specify 3 new keys

1. `onSuccess` can change default on success handling
```javascript
export const onSuccess = ({action, next, response, getState, dispatch}) => {
  ... //handle success
}
```

2. `onError` can change default on error handling
```javascript
export const onError = ({action, next, error, getState, dispatch}) => {
  ... //handle error
}
```

3. `onComplete` can trigger new on complete action
NOTE: action in `onComplete` handler is the new one returned by `onSuccess` or `onError` handler
```javascript
export const onComplete = ({action, next, getState, dispatch}) => {
  ... //handle complete
}
```

4. `errorSuffix` and `successSuffix` for changing keys suffixed to action type 

## License

MIT

## Acknowledgements

[Dan Abramov](https://github.com/gaearon) for Redux
[Matt Zabriskie](https://github.com/mzabriskie) for [Axios](https://github.com/mzabriskie/axios). A Promise based HTTP client for the browser and node.js
