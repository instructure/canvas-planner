/*
 * Copyright (C) 2017 - present Instructure, Inc.
 *
 * This file is part of Canvas.
 *
 * Canvas is free software: you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License as published by the Free
 * Software Foundation, version 3 of the License.
 *
 * Canvas is distributed in the hope that they will be useful, but WITHOUT ANY
 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
 * A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
 * details.
 *
 * You should have received a copy of the GNU Affero General Public License along
 * with this program. If not, see <http://www.gnu.org/licenses/>.
 */

import moment from 'moment-timezone';
import { select, call, put } from 'redux-saga/effects';
import { gotItemsSuccess, gotItemsError, addPendingPastItems, flushPendingPastItems, sendFetchRequest } from '../../actions/loading-actions';
import { loadPastUntilNewActivitySaga } from '../sagas';

function initialState (overrides = {}) {
  return {loading: {seekingNewActivity: true}, days: [], timeZone: 'Asia/Tokyo', ...overrides};
}

function setupLoadingPastUntilNewActivitySaga () {
  const generator = loadPastUntilNewActivitySaga();
  generator.next();
  generator.next(initialState());
  return generator;
}

describe('loadPastUntilNewActivitySaga', () => {
  it('sends a fetch request for past items', () => {
    const generator = loadPastUntilNewActivitySaga();
    expect(generator.next().value).toEqual(select());
    const currentState = initialState();
    const startOfDay = moment.tz(currentState.timeZone).startOf('day');
    expect(generator.next(currentState).value).toEqual(call(sendFetchRequest, {
      getState: expect.any(Function),
      fromMoment: startOfDay,
      intoThePast: true,
    }));
  });

  it('reports fetched items', () => {
    const generator = setupLoadingPastUntilNewActivitySaga();
    expect(generator.next({transformedItems: 'some items', response: 'some response'}).value)
      .toEqual(put(addPendingPastItems('some items', 'some response')));
  });

  it('aborts and reports if the fetch fails', () => {
    const generator = setupLoadingPastUntilNewActivitySaga();
    const expectedError = new Error('some error');
    expect(generator.throw(expectedError).value).toEqual(put(gotItemsError(expectedError)));
    expect(generator.next().value).toEqual(put(flushPendingPastItems()));
    expect(() => generator.next()).toThrow();
  });

  it('stops when seekingNewActivity becomes false', () => {
    const generator = setupLoadingPastUntilNewActivitySaga();
    generator.next({transformedItems: 'some past items', response: 'some response'});
    expect(generator.next(/*put*/).value).toEqual(select());
    expect(generator.next(initialState({
      pendingItems: {past: 'past'},
      loading: {seekingNewActivity: false},
    })).value).toEqual(put(gotItemsSuccess('past')));
    expect(generator.next().value).toEqual(put(flushPendingPastItems()));
    expect(generator.next().done).toBeTruthy();
  });

  it('keeps fetching while seekingNewActivity', () => {
    const currentState = initialState();
    const startOfDay = moment.tz(currentState.timeZone).startOf('day');
    const generator = setupLoadingPastUntilNewActivitySaga();
    generator.next({transformedItems: 'some past items', response: 'some response'});
    generator.next(/*put*/);
    const nextIteration = generator.next(currentState);
    expect(nextIteration.done).toBeFalsy();
    expect(nextIteration.value).toEqual(
      call(sendFetchRequest, {fromMoment: startOfDay, intoThePast: true, getState: expect.any(Function)})
    );
  });
});

// describe('loadFutureUntilNewDay', () => {
//   it('sends request and reports response for future items', () => {
//     const currentState = initialState();
//     const startOfDay = moment.tz(currentState.timeZone).startOf('day');
//     const generator = loadFutureUntilNewDay();
//     generator.next();
//     expect(generator.next(currentState).value).toEqual(call(sendFetchRequest, {
//       state: currentState,
//       fromMoment: startOfDay,
//     }));
//     expect(generator.next({transformedItems: 'some items', response: 'some response'}).value)
//       .toEqual(put(gotFutureItems('some items', 'some response')));
//   });
//
//   it('keeps loading until a full future day loaded', () => {
//     let currentState = initialState();
//     const generator = loadFutureUntilNewDay();
//     generator.next();
//     generator.next(currentState);
//     generator.next({transformedItems: 'some items', response: 'some response'});
//     generator.next(/* put */);
//     expect(generator.next(currentState).done).toBeFalsy();
//     generator.next({transformedItems: 'more items', response: 'another response'});
//     generator.next(/* put */);
//     currentState = {...currentState, days: ['some days']};
//     expect(generator.next(currentState).value).toEqual(call(alertDaysLoaded, 1));
//     expect(generator.next(/* alert */).done).toBeTruthy();
//   });
//
//   it('stops if allFutureItemsLoaded', () => {
//     let currentState = initialState();
//     const generator = loadFutureUntilNewDay();
//     generator.next();
//     generator.next(currentState);
//     generator.next({transformedItems: 'some items', response: 'some response'});
//     generator.next(/* put */);
//     expect(generator.next(currentState).done).toBeFalsy();
//     generator.next({transformedItems: 'more items', response: 'another response'});
//     generator.next(/* put */);
//     currentState = {...currentState, loading: {...currentState.loading, allFutureItemsLoaded: true}};
//     expect(generator.next(currentState).value).toEqual(call(alertDaysLoaded, 0));
//     expect(generator.next(/* alert */).done).toBeTruthy();
//   });
// });
//
// describe('loadPastUntilNewDay', () => {
//   it('sends request and reports response for past items', () => {
//     const currentState = initialState();
//     const startOfDay = moment.tz(currentState.timeZone).startOf('day');
//     const generator = loadPastUntilNewDay();
//     generator.next();
//     expect(generator.next(currentState).value).toEqual(call(sendFetchRequest, {
//       state: currentState,
//       fromMoment: startOfDay,
//       intoThePast: true,
//     }));
//     expect(generator.next({transformedItems: 'some items', response: 'some response'}).value)
//       .toEqual(put(gotPastItems('some items', 'some response')));
//   });
//
//   it('keeps loading until a full past day loaded', () => {
//     let currentState = initialState();
//     const generator = loadPastUntilNewDay();
//     generator.next();
//     generator.next(currentState);
//     generator.next({transformedItems: 'some items', response: 'some response'});
//     generator.next(/* put */);
//     expect(generator.next(currentState).done).toBeFalsy();
//     generator.next({transformedItems: 'more items', response: 'another response'});
//     generator.next(/* put */);
//     currentState = {...currentState, days: ['some days']};
//     expect(generator.next(currentState).value).toEqual(call(alertDaysLoaded, 1));
//     expect(generator.next(/* alert */).done).toBeTruthy();
//   });
//
//   it('stops if allPastItemsLoaded', () => {
//     let currentState = initialState();
//     const generator = loadPastUntilNewDay();
//     generator.next();
//     generator.next(currentState);
//     generator.next({transformedItems: 'some items', response: 'some response'});
//     generator.next(/* put */);
//     expect(generator.next(currentState).done).toBeFalsy();
//     generator.next({transformedItems: 'more items', response: 'another response'});
//     generator.next(/* put */);
//     currentState = {...currentState, loading: {...currentState.loading, allPastItemsLoaded: true}};
//     expect(generator.next(currentState).value).toEqual(call(alertDaysLoaded, 0));
//     expect(generator.next(/* alert */).done).toBeTruthy();
//   });
// });
