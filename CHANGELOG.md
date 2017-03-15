# CHANGELOG

## 3.1.3 ( March 15, 2017 )
- in interceptors, you can use `getAction` to receive action which triggered interceptors, for now, bug with `action` will not be removed, but it'll be removed in 4.0 as it is breaking change

## 3.1.2 ( Feb 20, 2017 )
- exclude our .babelrc from our npm build.

## 3.1.1 ( Feb 17, 2017 )
- corrected the entry for the webpack config

## 3.1.0 ( Feb 17, 2017 )
- add webpack build to support UMD [#40](https://github.com/svrcekmichal/redux-axios-middleware/issues/40)
- exported success and error suffixes [#42](https://github.com/svrcekmichal/redux-axios-middleware/issues/42)

## 3.0.0 ( Sep 8, 2016 )
- changed default action prefixing

## 2.0.0 ( Aug 10, 2016 )
- changes to support axios@0.13
- removed enhanced getState function as first interceptor argument

## 1.3.0 ( Jun 14, 2016 )
- added warning to not use first interceptor argument as `getState` function
- added `dispatch` and `action` to first interceptor argument - [#26](https://github.com/svrcekmichal/redux-axios-middleware/pull/26)

## 1.2.0 ( Jun 7, 2016 )
- provide ability to specify failure interceptors that run when request fails [#20](https://github.com/svrcekmichal/redux-axios-middleware/issues/20)
- fixed interceptors default values

## 1.1.0 ( Jun 1, 2016 )
- support for multiple client [#6](https://github.com/svrcekmichal/redux-axios-middleware/issues/6)
- configuration of middleware on all layers (middleware, client, action) 
- Fixes throw uncaught exception in axios error with `returnRejectedPromiseOnError` options

## 1.0.0
- first stable version of middleware
