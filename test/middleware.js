import axios from 'axios';
import configureMockStore from 'redux-mock-store';
import { expect } from 'chai';
import MockAdapter from 'axios-mock-adapter';

import middleware from './../src/middleware';

const client = axios.create({
  responseType: 'json'
});

const mockAxiosClient = new MockAdapter(client);
const mockStore = configureMockStore([middleware(client)]);
const mockAdapter = mockAxiosClient.adapter();

describe('middleware', () => {
  afterEach(() => {
    mockAxiosClient.reset();
  });

  after(() => {
    mockAxiosClient.restore();
  });

  it('should dispatch _SUCCESS', () => {
    mockAxiosClient.onGet('/test').reply(200, 'response');

    const expectActions = [{
      type: 'LOAD',
      payload: {
        request: {
          url: '/test',
          adapter: mockAdapter
        }
      }
    }, {
      type: 'LOAD_SUCCESS',
      payload: {
        data: 'response'
      }
    }];
    const store = mockStore();
    return store.dispatch(expectActions[0]).then(() => {
      expect(store.getActions()).to.shallowDeepEqual(expectActions);
    });
  });
  it('should dispatch _FAIL', () => {
    mockAxiosClient.onGet('/test').reply(404);
    const expectActions = [{
      type: 'LOAD',
      payload: {
        request: {
          url: 'test',
          adapter: mockAdapter
        }
      }
    }, {
      type: 'LOAD_FAIL',
      error: {
        response: {
          status: 404
        }
      }
    }];
    const store = mockStore();
    return store.dispatch(expectActions[0]).then(() => {
      expect(store.getActions()).to.shallowDeepEqual(expectActions);
    });
  });
});
