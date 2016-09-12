# CHANGELOG

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
