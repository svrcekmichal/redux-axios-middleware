import { expect } from 'chai';
import { getActionTypes } from './../src/getActionTypes';
import { isAxiosRequest, getRequestConfig, onSuccess, onError } from './../src/defaults';

describe('defaults', () => {

  describe('isAxiosRequest', () => {

    it('should check valid axios request', () => {
      const action = { payload: { request: {} } };
      expect(isAxiosRequest(action)).to.be.ok;
    });

    it('should check valid axios request', () => {
      const action = { payload: {} };
      expect(isAxiosRequest(action)).to.be.not.ok;
    });

  });

  describe('getRequestConfig', () => {

    it('should return request config', () => {
      const request = {
        url: '/abc'
      };
      const action = { payload: { request } };
      expect(getRequestConfig(action)).to.equal(request);
    })

  });

  describe('onSuccess', () => {

    let resultAction = null;
    let next = (action) => resultAction = action;
    const response = {
      data: [1,2,3],
      status:200,
      statusTest:'OK',
      headers:{},
      config: {}
    };

    beforeEach(() => {
      resultAction = null;
    });

    it('should fire action with response as payload', () => {

      const action = {
        type:'REQUEST',
        payload:{
          request:{
            url:'/request-url'
          }
        }
      };

      const { data, ...metaResponse } = response;
      onSuccess({action, next, response});
      expect(resultAction).to.shallowDeepEqual({
        type: getActionTypes(action)[1],
        payload:data,
        meta: {
          request: action.payload.request,
          response: metaResponse
        }
      })

    });

    it('should move other keys than request to meta', () => {

      const action = {
        type:'REQUEST',
        payload:{
          moveKey: 'this will move to meta',
          request:{
            url:'/request-url'
          }
        }
      };

      onSuccess({action, next, response});
      expect(resultAction).to.shallowDeepEqual({
        meta: { moveKey: 'this will move to meta' }
      })

    });

    it('should preserve not used top level keys', () => {

      const action = {
        type:'REQUEST',
        notUsed: true,
        payload:{
          request:{
            url:'/request-url'
          }
        }
      };

      onSuccess({action, next, response});
      expect(resultAction).to.shallowDeepEqual({
        notUsed: true
      })

    });

  });

  describe('onError', () => {

    let resultAction = null;
    let next = (action) => resultAction = action;
    const error = {
      data: ['Error1','Error2'],
      status:400,
      statusTest:'BAD_REQUEST',
      headers:{},
      config: {}
    };

    beforeEach(() => {
      resultAction = null;
    });

    it('should fire action with error', () => {

      const action = {
        type:'REQUEST',
        payload:{
          request:{
            url:'/request-url'
          }
        }
      };

      onError({action, next, error});

      const { data, ...metaResponse } = error;
      expect(resultAction).to.shallowDeepEqual({
        type: getActionTypes(action)[2],
        error: data,
        meta: {
          request: action.payload.request,
          response: metaResponse
        }
      })

    });

    it('should move payload to meta', () => {

      const action = {
        type:'REQUEST',
        payload:{
          moveKey: 'this will move to meta',
          request:{
            url:'/request-url'
          }
        }
      };

      onError({action, next, error});
      expect(resultAction).to.shallowDeepEqual({
        meta: { moveKey: 'this will move to meta' }
      })

    });

    it('should not touch not used top level keys', () => {

      const action = {
        type:'REQUEST',
        notUsed: true,
        payload:{
          request:{
            url:'/request-url'
          }
        }
      };

      onError({action, next, error});
      expect(resultAction).to.shallowDeepEqual({
        notUsed: true
      })

    });

  });

});
