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

### Request complete

After request complete, middleware will dispatch new action, 

#### on success

```javascript
{
  type: 'AWESOME', //success type
  payload: { ... } //axios response object with data status headers etc.
  meta: {
    previousAction: { ... } //action which triggered request
  }
}
```

#### on error

Error action is same as success action with one difference, there's no key `payload`, but now there's `error`;

```js
{
    type:'OH_NO',
    error: { ... }, //axios error response object with data status headers etc.
    meta: {
      previousAction: { ... } //action which triggered request
    }
}
```

#### if axios failed fatally, default erro action with status `0` will be dispatched

```js
{
    type:'OH_NO',
    error: { 
      status: 0,
      ... //rest of axios error response object
    }, 
    meta: {
      previousAction: { ... } //action which triggered request
    }
}
```

### Middleware options

Options can be changed on multiple levels. They are merged in following direction:
```
default middleware values < middleware config < client config < action config 
```
All values except interceptors are overriden, interceptors are merged in same order.
Some values are changeable only on certain level (can be seen in change level column). 

Legend:
`M` - middleware config
`C` - client config
`A` - action config


| key | type | default value | change level | description |
|---|---|---|---|
|successSuffix|string|SUCCESS|`M` `C` `A`|  default suffix added to success action, for example `{type:"READ"}` will be `{type:"READ_SUCCESS"}`|
|errorSuffix|string|FAIL|`M` `C` `A`|same as above|
|onSuccess|function|described above|`M` `C` `A`|function called if axios resolve with success|
|onError|function|described above|`M` `C` `A`|function called if axios resolve with error|
|onComplete|function|-|`M` `C` `A`|unction called after axios resolve|
|returnRejectedPromiseOnError|bool|false|`M` `C` `A`|if `true`, axios onError handler will return `Promise.reject(newAction)` instead of `newAction`|
|isAxiosRequest|function|function check if action contain `action.payload.request`|`M`|check if action is axios request, this is connected to `getRequestConfig`|
|getRequestConfig|function|return content of `action.payload.request`|`M` `C` `A`|if `isAxiosRequest` returns true, this function get axios request config from action|
|getClientName|function|returns `action.payload.client` OR `'default'`|`M` `C` `A`|attempts to resolve used client name or use defaultClientName|
|defaultClientName|every possible object key type|`'default'`|`M`|key which define client used if `getClienName` returned false value|
|getRequestOptions|function|return `action.payload.options`|`M` `C`|returns options object from action to override some values|
|interceptors|object {request: [], response: []}|-|`M` `C`|You can pass axios request and response interceptors. Take care, first argument of interceptor is different from default axios interceptor, first received argument is `getState` function|

## License

MIT

## Acknowledgements

[Dan Abramov](https://github.com/gaearon) for Redux
[Matt Zabriskie](https://github.com/mzabriskie) for [Axios](https://github.com/mzabriskie/axios). A Promise based HTTP client for the browser and node.js
