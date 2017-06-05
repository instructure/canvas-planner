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

export function moxiosRespond (response, requestPromise, opts = {}) {
  if (!isPromise(requestPromise)) throw new Error('moxiosResult requires a promise for the request');
  const waitPromise = moxiosWait((request) => {
    request.respondWith({status: 200, headers: {}, response, ...opts});
  });
  return Promise.all([waitPromise, requestPromise])
    .then(([waitResult, requestResult]) => {
      return requestResult;
    })
  ;
}
