import {moxiosWait, moxiosRespond} from '../index';
import axios from 'axios';
import moxios from 'moxios';

describe('moxiosWait', () => {
  it('rejects if the passed function throws', () => {
    const waitPromise = moxiosWait(() => {
      throw new Error('intentional error for testing');
    });
    return new Promise((resolve, reject) => {
      waitPromise
        .then(() => reject('did not expect waitPromise to resolve'))
        .catch(() => resolve('yay, this is what its supposed to do'))
      ;
    });
  });
});

describe('moxiosRespond', () => {
  beforeEach(() => {
    moxios.install();
  });

  afterEach(() => {
    moxios.uninstall();
  });

  it('throws if the request promise parameter is missing', () => {
    expect(() => moxiosRespond('blah')).toThrow();
  });

  it('merges options into the response', () => {
    const requestPromise = axios.get('http://example.com');
    const responsePromise = moxiosRespond({some: 'data'}, requestPromise, {status: 418, headers: {key: 'value'}});
    return responsePromise.catch((err) => {
      expect(err.response.data).toMatchObject({some: 'data'});
      expect(err.response.headers).toMatchObject({key: 'value'});
      expect(err.response.status).toBe(418);
    });
  });
});
