import {moxiosWait, moxiosRespond} from '../index';

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
  it('throws if the request promise parameter is missing', () => {
    expect(() => moxiosRespond('blah')).toThrow();
  });
});
