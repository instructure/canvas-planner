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
import * as Actions from '../loading-actions';
import moxios from 'moxios';
import moment from 'moment-timezone';
import {isPromise, moxiosWait, moxiosRespond} from '../../test-utils';
import { initialize as alertInitialize } from '../../utilities/alertUtils';

jest.mock('../../utilities/apiUtils', () => ({
  transformApiToInternalItem: jest.fn(response => ({
    ...response,
    newActivity: response.new_activity,
    transformedToInternal: true
  })),
  transformInternalToApiItem: jest.fn(internal => ({...internal, transformedToApi: true})),
}));

const getBasicState = () => ({
  courses: [],
  timeZone: 'UTC',
  days: [
    ['2017-05-22', [{id: '42', dateBucketMoment: moment.tz('2017-05-22', 'UTC')}]],
    ['2017-05-24', [{id: '42', dateBucketMoment: moment.tz('2017-05-24', 'UTC')}]],
  ],
  loading: {
    futureNextUrl: null,
    pastNextUrl: null,
  },
  pendingItems: {
    past: [],
    future: [],
  },
});

describe('api actions', () => {
  beforeEach(() => {
    moxios.install();
    expect.hasAssertions();
    alertInitialize({
      visualSuccessCallback () {},
      visualErrorCallback () {},
      srAlertCallback () {}
    });
  });

  afterEach(() => {
    moxios.uninstall();
  });

  describe('sendFetchRequest', () => {
    it('fetches from the specified moment if there is no next url in the loadingOptions', () => {
      const fromMoment = moment.tz('Asia/Tokyo');
      Actions.sendFetchRequest({
        fromMoment, getState: () => ({loading: {}}),
      });
      return moxiosWait(request => {
        expect(request.config.url).toBe('/api/v1/planner/items');
        expect(request.config.params.start_date).toBe(fromMoment.format());
      });
    });

    it('fetches using futureNextUrl if specified', () => {
      const fromMoment = moment.tz('Asia/Tokyo');
      Actions.sendFetchRequest({
        fromMoment, getState: () => ({loading: {futureNextUrl: 'next url'}}),
      });
      return moxiosWait(request => {
        expect(request.config.url).toBe('next url');
      });
    });

    it('sends past parameters if intoThePast is specified', () => {
      const fromMoment = moment.tz('Asia/Tokyo');
      Actions.sendFetchRequest({
        fromMoment, intoThePast: true, getState: () => ({loading: {}}),
      });
      return moxiosWait(request => {
        expect(request.config.url).toBe('/api/v1/planner/items');
        expect(request.config.params.end_date).toBe(fromMoment.format());
        expect(request.config.params.order).toBe('desc');
      });
    });

    it('sends pastNextUrl if intoThePast is specified', () => {
      const fromMoment = moment.tz('Asia/Tokyo');
      Actions.sendFetchRequest({
        fromMoment, intoThePast: true, getState: () => ({loading: {pastNextUrl: 'past next url'}}),
      });
      return moxiosWait(request => {
        expect(request.config.url).toBe('past next url');
      });
    });

    it('invokes onError on fetch error', () => {
      const onError = jest.fn();
      const fromMoment = moment.tz('Asia/Tokyo');
      const loadingOptions = {fromMoment, onError, getState: () => ({loading: {}})};
      const fetchPromise = Actions.sendFetchRequest(loadingOptions);
      return moxiosRespond(
        { some: 'response data' },
        fetchPromise,
        { status: 500 }
      ).then((result) => {
        expect(onError).toHaveBeenCalledWith(loadingOptions, expect.anything());
      });
    });

    it('transforms the results', () => {
      const fromMoment = moment.tz('Asia/Tokyo');
      const fetchPromise = Actions.sendFetchRequest({fromMoment, getState: () => ({loading: {}})});
      return moxiosRespond([{some: 'items'}], fetchPromise).then(result => {
        expect(result).toEqual({
          response: expect.anything(),
          transformedItems: [{some: 'items', transformedToInternal: true}]});
      });
    });
  });

  describe('getPlannerItems', () => {
   it('dispatches startLoadingItems and getFirstNewActivityDate initially', () => {
     const fakeDispatch = jest.fn();
     Actions.getPlannerItems(moment())(fakeDispatch, getBasicState);
     expect(fakeDispatch).toHaveBeenCalledWith(expect.objectContaining({
       type: 'START_LOADING_ITEMS'
     }));

     // also dispatches getFirstNewActivityDate thunk
     expect(typeof fakeDispatch.mock.calls[1][0]).toBe('function');
     const getFirstNewActivityDateThunk = fakeDispatch.mock.calls[1][0];
     const mockMoment = moment();
     const newActivityPromise = getFirstNewActivityDateThunk(fakeDispatch, getBasicState);
     return moxiosRespond([{dateBucketMoment: mockMoment}], newActivityPromise).then((result) => {
       expect(fakeDispatch).toHaveBeenCalledWith(expect.objectContaining({
         type: 'FOUND_FIRST_NEW_ACTIVITY_DATE',
       }));
     });
   });

   it('calls srAlert indicating the number of items retrieved', () => {
     const fakeDispatch = jest.fn();
     const fakeSrAlert = jest.fn();
     alertInitialize({
       srAlertCallback: fakeSrAlert
     });
     const loadingPromise = Actions.getPlannerItems(moment())(fakeDispatch, getBasicState);
     return moxiosRespond([{some: 'data'}], loadingPromise).then((result) => {
       expect(fakeSrAlert).toHaveBeenCalledWith('Loaded 1 item');
     });
   });

   it('dispatches GOT_ITEMS_SUCCESS after items are loaded', () => {
     const fakeDispatch = jest.fn();
     const loadingPromise = Actions.getPlannerItems(moment())(fakeDispatch, getBasicState);
     return moxiosRespond([{some: 'data'}], loadingPromise).then((result) => {
       const callParams = fakeDispatch.mock.calls[2][0];
       expect(callParams).toMatchObject({
         type: 'GOT_ITEMS_SUCCESS',
         payload: {
           internalItems: [{some: 'data', transformedToInternal: true}],
         },
       });
       expect(callParams.payload).toHaveProperty('response');
     });
   });

   it('dispatches all items loaded if no items loaded', () => {
     const fakeDispatch = jest.fn();
     const loadingPromise = Actions.getPlannerItems(moment())(fakeDispatch, getBasicState);
     return moxiosRespond([], loadingPromise).then((result) => {
       expect(fakeDispatch).toHaveBeenCalledWith({type: 'ALL_FUTURE_ITEMS_LOADED'});
     });
   });
  });

  describe('getFirstNewActivityDate', () => {
    it('sends deep past, filter, and order parameters', () => {
      const mockDispatch = jest.fn();
      const mockMoment = moment.tz('Asia/Tokyo').startOf('day');
      Actions.getFirstNewActivityDate(mockMoment)(mockDispatch, getBasicState);
      return moxiosWait(request => {
        expect(request.config.params.filter).toBe('new_activity');
        expect(request.config.params.start_date).toBe(mockMoment.subtract(6, 'months').format());
        expect(request.config.params.order).toBe('asc');
      });
    });

    it('calls the alert method when it fails to get new activity', () => {
      const fakeAlert = jest.fn();
      alertInitialize({
        visualErrorCallback: fakeAlert
      });
      const mockDispatch = jest.fn();
      const mockMoment = moment.tz('Asia/Tokyo').startOf('day');
      const promise = Actions.getFirstNewActivityDate(mockMoment)(mockDispatch, getBasicState);
      return moxiosRespond(
        { some: 'response data' },
        promise,
        { status: 500 }
      ).then((result) => {
        expect(fakeAlert).toHaveBeenCalled();
      });
    });
  });

  describe('loadFutureItems', () => {
    it('dispatches loading actions', () => {
      const mockDispatch = jest.fn();
      const fetchPromise = Actions.loadFutureItems()(mockDispatch, getBasicState);
      expect(isPromise(fetchPromise));
      expect(mockDispatch).toHaveBeenCalledWith(expect.objectContaining({
        type: 'GETTING_FUTURE_ITEMS',
        payload: {},
      }));
      // GOT_ITEMS_SUCCESS is dispatched by the action when internal promise is fulfulled
    });

    it('dispatches gotItemsError on fetch error', () => {
      const mockDispatch = jest.fn();
      const fetchPromise = Actions.loadFutureItems()(mockDispatch, getBasicState);
      return moxiosRespond(
        { some: 'response data' },
        fetchPromise,
        { status: 500 }
      ).then((result) => {
        expect(mockDispatch).toHaveBeenCalledWith(expect.objectContaining({
          type: 'GOT_ITEMS_ERROR'
        }));
      });
    });

    it('sends the start_date parameter as one day after the last day if no futureNextUrl', () => {
      const mockDispatch = jest.fn();
      const numDays = getBasicState().days.length;
      const afterMoment = getBasicState().days[numDays-1][1][0].dateBucketMoment
        .clone().add(1, 'days');
      Actions.loadFutureItems()(mockDispatch, getBasicState);
      return moxiosWait((request) => {
        expect(moment(request.config.params.start_date).isSame(afterMoment)).toBeTruthy();
      });
    });

    it('sends the next url if there is a futureNextUrl', () => {
      const mockDispatch = jest.fn();
      const modifiedState = getBasicState();
      modifiedState.loading.futureNextUrl = 'some next url';
      Actions.loadFutureItems()(mockDispatch, () => modifiedState);
      return moxiosWait((request) => {
        expect(request.url).toBe('some next url');
      });
    });

    it('dispatches GOT_ITEMS_SUCCESS with transformed response data', () => {
      const mockDispatch = jest.fn();
      const fetchPromise = Actions.loadFutureItems()(mockDispatch, getBasicState);
      return moxiosRespond([{some: 'response'}], fetchPromise).then(result => {
        const gotItemsParams = mockDispatch.mock.calls[1][0];
        expect(gotItemsParams).toMatchObject({
          type: 'GOT_ITEMS_SUCCESS',
          payload: {
            internalItems: [{some: 'response', transformedToInternal: true}],
          },
        });
        expect(gotItemsParams.payload).toHaveProperty('response');
      });
    });

    it('dispatches all future items loaded if no items loaded and there is no next link', () => {
      const mockDispatch = jest.fn();
      const fetchPromise = Actions.loadFutureItems()(mockDispatch, getBasicState);
      return moxiosRespond([], fetchPromise).then(result => {
        expect(mockDispatch).toHaveBeenCalledWith({type: 'ALL_FUTURE_ITEMS_LOADED'});
      });
    });

    it('does not dispatch all future items loaded if no items loaded and there is a next link', () => {
      const mockDispatch = jest.fn();
      const fetchPromise = Actions.loadFutureItems()(mockDispatch, getBasicState);
      return moxiosRespond([], fetchPromise, {headers: {link: '<futureNextUrl>; rel="next"'}}).then(result => {
        expect(mockDispatch).not.toHaveBeenCalledWith({type: 'ALL_FUTURE_ITEMS_LOADED'});
      });
    });
  });

  describe('scrollIntoPast', () => {
    it('dispatches scrolling and got items actions', () => {
      const mockDispatch = jest.fn();
      const scrollPromise = Actions.scrollIntoPast()(mockDispatch, getBasicState);
      expect(isPromise(scrollPromise));
      expect(mockDispatch).toHaveBeenCalledWith({type: 'GETTING_PAST_ITEMS', payload: {seekingNewActivity: false}});
      return moxiosRespond([{some: 'response'}], scrollPromise).then((result) => {
        const gotItemsParams = mockDispatch.mock.calls[1][0];
        expect(gotItemsParams).toMatchObject({
          type: 'GOT_ITEMS_SUCCESS',
          payload: {
            internalItems: [{some: 'response', transformedToInternal: true}],
          },
        });
        expect(gotItemsParams.payload).toHaveProperty('response');
      });
    });

    it('sends end_date parameter as the first loaded day', () => {
      const mockDispatch = jest.fn();
      const beforeMoment = getBasicState().days[0][1][0].dateBucketMoment;
      Actions.scrollIntoPast()(mockDispatch, getBasicState);
      return moxiosWait((request) => {
        expect(moment(request.config.params.end_date).isSame(beforeMoment)).toBeTruthy();
      });
    });

    it('sends the pastNextUrl if there is one', () => {
      const mockDispatch = jest.fn();
      const modifiedState = getBasicState();
      modifiedState.loading.pastNextUrl = 'some past url';
      Actions.scrollIntoPast()(mockDispatch, () => modifiedState);
      return moxiosWait((request) => {
        expect(request.url).toBe('some past url');
      });
    });

    it('dispatches all past items loaded if nothing was loaded and there is no next link', () => {
      const mockDispatch = jest.fn();
      const fetchPromise = Actions.scrollIntoPast()(mockDispatch, getBasicState);
      return moxiosRespond([], fetchPromise).then(result => {
        expect(mockDispatch).toHaveBeenCalledWith({type: 'ALL_PAST_ITEMS_LOADED'});
      });
    });

    it('does not dispatch all past items loaded if there is a next link', () => {
      const mockDispatch = jest.fn();
      const fetchPromise = Actions.scrollIntoPast()(mockDispatch, getBasicState);
      return moxiosRespond([], fetchPromise, {headers: {link: '<futureNextUrl>; rel="next"'}}).then(result => {
        expect(mockDispatch).not.toHaveBeenCalledWith(expect.objectContaining({type: 'ALL_PAST_ITEMS_LOADED'}));
      });
    });

    it('does not make the api call if allPastItemsLoaded', () => {
      const mockDispatch = jest.fn();
      let modifiedState = getBasicState();
      modifiedState.loading.allPastItemsLoaded = true;
      Actions.scrollIntoPast()(mockDispatch, () => modifiedState);
      expect(mockDispatch).not.toHaveBeenCalled();
    });
  });

  describe('loadPastUntilNewActivity', () => {
    it('dispatches getting past items and starts the saga', () => {
      const mockDispatch = jest.fn();
      Actions.loadPastUntilNewActivity()(mockDispatch, (getBasicState));
      expect(mockDispatch).toHaveBeenCalledWith({type: 'GETTING_PAST_ITEMS', payload: {seekingNewActivity: true}});
      expect(mockDispatch).toHaveBeenCalledWith({type: 'START_LOADING_PAST_UNTIL_NEW_ACTIVITY'});
    });
  });
});
