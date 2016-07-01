import axios from 'axios';
import configureMockStore from 'redux-mock-store';
import {expect} from 'chai';
import MockAdapter from 'axios-mock-adapter';

import middleware from './../src/middleware';

const BASE_URL = 'mockapi';

const getAction = adapter => ({
  type: 'LOAD',
  payload: {
    request: {
      url: '/test',
      adapter: adapter
    }
  }
});

const successAction = {
  type: 'LOAD_SUCCESS',
  payload: {
    data: 'response success'
  }
};

const errorAction = {
  type: 'LOAD_FAIL',
  error: {
    data: 'response error'
  }
};

let mockAxiosClient;
let mockStore;
let mockAdapter;

const initializeMiddleware = options => {
  const client = axios.create({
    baseURL: BASE_URL,
    responseType: 'json'
  });

  mockAxiosClient = new MockAdapter(client);
  mockStore = configureMockStore([middleware(client, options)]);
  mockAdapter = mockAxiosClient.adapter();
};

describe('interceptor', () => {
  afterEach(() => {
    mockAxiosClient.reset();
  });

  after(() => {
    mockAxiosClient.restore();
  });

  describe('should call request interceptor', () => {

    it('defined as function', () => {
      let successCalled = 0;
      const options = {
        interceptors: {
          request: [({}, config) => {
            successCalled++;
            return config;
          }]
        }
      };

      initializeMiddleware(options);
      mockAxiosClient.onGet(`${BASE_URL}/test`).reply(200, 'response success');
      const store = mockStore();
      const action = getAction(mockAdapter);
      return store.dispatch(action).then(() => {
        expect(successCalled).to.equal(1);
        expect(store.getActions()).to.shallowDeepEqual([action,successAction]);
      });
    });

    it('defined as object', () => {
      let successCalled = 0;
      let errorCalled = 0;
      const options = {
        interceptors: {
          request: [{
            success: ({}, config) => {
              successCalled++;
              return config;
            },
            error: ({}, error) => {
              errorCalled++;
              return Promise.reject(error);
            }
          }]
        }
      };

      initializeMiddleware(options);
      mockAxiosClient.onGet(`${BASE_URL}/test`).reply(200, 'response success');
      const store = mockStore();
      const action = getAction(mockAdapter);
      return store.dispatch(action).then(() => {
        expect(successCalled).to.equal(1);
        expect(errorCalled).to.equal(0);
        expect(store.getActions()).to.shallowDeepEqual([action,successAction]);
      });
    });
  });

  it('should not call request if request interceptor failed', () => {
    const options = {
      interceptors: {
        request: [({}, config) => Promise.reject(new Error('stopped by interceptor'))]
      }
    };
    initializeMiddleware(options);
    const store = mockStore();
    const action = getAction(mockAdapter);
    return store.dispatch(action).then(() => {
      expect(store.getActions()).to.shallowDeepEqual([action,{error: {status: 0, data: 'stopped by interceptor'}}]);
    });
  });

  it('should call success response interceptor if request successed', () => {
    let successCalled = 0;
    let errorCalled = 0;
    const options = {
      interceptors: {
        response: [{
          success: ({}, response) => {
            successCalled++;
            return response;
          },
          error: ({}, error) => {
            errorCalled++;
            return Promise.reject(error);
          }
        }]
      }
    };
    initializeMiddleware(options);
    mockAxiosClient.onGet(`${BASE_URL}/test`).reply(200, 'response success');
    const store = mockStore();
    const action = getAction(mockAdapter);
    return store.dispatch(action).then(() => {
      expect(store.getActions()).to.shallowDeepEqual([action,successAction]);
    });
  });

  it('should call error response interceptor if request failed', () => {
    let successCalled = 0;
    let errorCalled = 0;
    const options = {
      interceptors: {
        response: [{
          success: ({}, response) => {
            successCalled++;
            return response;
          },
          error: ({}, error) => {
            errorCalled++;
            return Promise.reject(error);
          }
        }]
      }
    };
    initializeMiddleware(options);
    mockAxiosClient.onGet(`${BASE_URL}/test`).reply(500, 'response error');
    const store = mockStore();
    const action = getAction(mockAdapter);
    return store.dispatch(action).then(() => {
      expect(store.getActions()).to.shallowDeepEqual([action,errorAction]);
      expect(successCalled).to.equal(0);
      expect(errorCalled).to.equal(1);
    });
  });
});
