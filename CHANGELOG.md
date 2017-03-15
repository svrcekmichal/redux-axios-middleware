# CHANGELOG

## 4.0.0
#### _Mar 14, 2017_

##### Breaking Changes
- [interceptors] We have replaced the `action` parameter with a new `getSourceAction` function which will return the action which triggered the interceptor. [#33](https://github.com/svrcekmichal/redux-axios-middleware/issues/33) [#34](https://github.com/svrcekmichal/redux-axios-middleware/issues/34)

##### Docs
- Updated the changelog formatting.

## 3.1.2
#### _Feb 20, 2017_

- exclude our .babelrc from our npm build.

## 3.1.1
#### _Feb 17, 2017_

- corrected the entry for the webpack config

## 3.1.0
#### _Feb 17, 2017_

- add webpack build to support UMD [#40](https://github.com/svrcekmichal/redux-axios-middleware/issues/40)
- exported success and error suffixes [#42](https://github.com/svrcekmichal/redux-axios-middleware/issues/42)

## 3.0.0
#### _Sep 8, 2016_

- changed default action prefixing

## 2.0.0
#### _Aug 10, 2016_

- changes to support axios@0.13
- removed enhanced getState function as first interceptor argument

## 1.3.0
#### _Jun 14, 2016_

- added warning to not use first interceptor argument as `getState` function
- added `dispatch` and `action` to first interceptor argument - [#26](https://github.com/svrcekmichal/redux-axios-middleware/pull/26)

## 1.2.0
#### _Jun 7, 2016_

- provide ability to specify failure interceptors that run when request fails [#20](https://github.com/svrcekmichal/redux-axios-middleware/issues/20)
- fixed interceptors default values

## 1.1.0
#### _Jun 1, 2016_

- support for multiple client [#6](https://github.com/svrcekmichal/redux-axios-middleware/issues/6)
- configuration of middleware on all layers (middleware, client, action) 
- Fixes throw uncaught exception in axios error with `returnRejectedPromiseOnError` options

## 1.0.0
- first stable version of middleware
