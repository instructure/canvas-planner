import moxios from 'moxios';

export function isPromise (subject) {
  return typeof subject !== 'undefined' &&
    typeof subject.then !== 'undefined' &&
    typeof subject.then === 'function';
}

export function moxiosWait (fn) {
  return new Promise((resolve, reject) => {
    moxios.wait(() => {
      try {
        resolve(fn(moxios.requests.mostRecent()));
      } catch (e) {
         reject(e);
       }
    });
  });
}
