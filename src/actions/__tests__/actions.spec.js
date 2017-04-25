import * as Actions from '../index';
import moxios from 'moxios';

describe('Test Actions', () => {
  describe('testAction', () => {
    it('returns the proper action', () => {
      const actual = Actions.testAction('abc');
      const expected = {
        type: 'TEST_ACTION',
        payload: 'abc'
      };

      expect(actual).toEqual(expected);
    });
  });

  describe('testAsyncAction', () => {
    beforeAll(() => {
      moxios.install();
    });

    afterAll(() => {
      moxios.uninstall();
    });

    it('dispatches the proper action on success', (done) => {
      const fakeDispatcher = jest.fn();
      const thunk = Actions.testAsyncAction();
      thunk(fakeDispatcher);
      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        request.respondWith({
          status: 200,
          response: { value: 'abc' }
        }).then(() => {
          expect(fakeDispatcher).toHaveBeenCalledWith(Actions.testAction('abc'));
          done();
        });
      });
    });

    it('makes a request to the proper url', (done) => {
      const fakeDispatcher = jest.fn();
      const thunk = Actions.testAsyncAction();
      thunk(fakeDispatcher);
      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        expect(request.url).toBe('/api/v1/items/1');
        done();
      });
    });
  });

});
