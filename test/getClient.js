import { expect } from 'chai';
import { getClient } from './../src/getClient';

describe('getClient', () => {

  it('should return the axios client', () => {
    const client = getClient({
      default: {
        axios: {
          baseURL: 'http://localhost:8080',
          responseType: 'json'
        },
        options: {}
      }
    }, {});
    expect(typeof client.request).to.equal('function');
  });

});
