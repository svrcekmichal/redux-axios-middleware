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

```javascript
import {createStore, applyMiddleware} from 'redux';
import axios from 'axios';
import axiosMiddleware from 'redux-axios-middleware';

const client = axios.create({ //all axios can be used, shown in axios documentation
  baseUrl:'http://localhost:8080/api',
  responseType: 'json'
});

let store = createStore(
  reducers, //custom reducers
  applyMiddleware(
    //all middlewares
    ...
    axiosMiddleware(client), //options can optionally contain onSuccess, onError, onComplete
    ...
  )
)
```

### Dispatch action

Every action which have `payload.request` defined will be handled by middleware. There are two possible type
definitions.

1. use `action.type` with string name
action with type will be dispatched on start, and then followed by type suffixed with `_SUCCESS` on success, or `_FAIL` on
axios on server error

```javascript
export function loadCategories() {
  return {
    type: 'LOAD', //on start LOAD, then LOAD_SUCCESS or LOAD_FAIL
    payload: {
      request:{
        url:'/categories'
      }
    }
  }
}
```


2. use `action.types` with array of types `[REQUEST,SUCCESS,FAILURE]`
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

### Next middleware

By default next middleware will receive new action object:

1. on success
```javascript
{
  type: 'AWESOME', //success type
  payload: {
    request:{
      url:'/categories'
    },
    response: {
      //response object from axios
    }
  }
}
```

2.on error

```javascript
{
  type: 'OH_NO',
  error: {
    request:{
      url:'/categories'
    },
    error: {
      //error object from axios
    }
  }
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

## License

MIT

## Acknowledgements

[Dan Abramov](https://github.com/gaearon) for Redux and a great example at [real-world](https://github.com/rackt/redux/blob/master/examples/real-world/middleware/api.js)

[Matt Zabriskie](https://github.com/mzabriskie) for [Axios](https://github.com/mzabriskie/axios). A Promise based HTTP client for the browser and node.js
