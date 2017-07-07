/*
 * Copyright (C) 2017 - present Instructure, Inc.
 *
 * This module is part of Canvas.
 *
 * This module and Canvas are free software: you can redistribute them and/or modify them under
 * the terms of the GNU Affero General Public License as published by the Free
 * Software Foundation, version 3 of the License.
 *
 * This module and Canvas are distributed in the hope that they will be useful, but WITHOUT ANY
 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
 * A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
 * details.
 *
 * You should have received a copy of the GNU Affero General Public License along
 * with this program. If not, see <http://www.gnu.org/licenses/>.
 */
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
