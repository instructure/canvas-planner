import * as Actions from '../loading-actions';
import moxios from 'moxios';
import moment from 'moment-timezone';
import {isPromise, moxiosWait, moxiosRespond} from '../../test-utils';
import { initialize as alertInitialize } from '../../utilities/alertUtils';

jest.mock('../../utilities/apiUtils', () => ({
  transformApiToInternalItem: jest.fn(response => ({...response, transformedToInternal: true})),
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

  describe('getPlannerItems', () => {
   it('dispatches startLoadingItems and getNewActivity initially', () => {
     const fakeDispatch = jest.fn();
     Actions.getPlannerItems(moment())(fakeDispatch, getBasicState);
     expect(fakeDispatch).toHaveBeenCalledWith(expect.objectContaining({
       type: 'START_LOADING_ITEMS'
     }));

     // also dispatches getNewActivity thunk
     expect(typeof fakeDispatch.mock.calls[1][0]).toBe('function');
     const getNewActivityThunk = fakeDispatch.mock.calls[1][0];
     const mockMoment = moment();
     const newActivityPromise = getNewActivityThunk(fakeDispatch, getBasicState);
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
       expect(fakeDispatch).toHaveBeenCalledWith({type: 'ALL_PAST_ITEMS_LOADED'});
     });
   });
  });

  describe('getNewActivity', () => {
    it('sends deep past and filter parameters', () => {
      const mockDispatch = jest.fn();
      const mockMoment = moment.tz('Asia/Tokyo').startOf('day');
      Actions.getNewActivity(mockMoment)(mockDispatch, getBasicState);
      return moxiosWait(request => {
        expect(request.config.params.filter).toBe('new_activity');
        expect(request.config.params.start_date).toBe(mockMoment.subtract(6, 'months').format());
      });
    });

    it('calls the alert method when it fails to get new activity', () => {
      const fakeAlert = jest.fn();
      alertInitialize({
        visualErrorCallback: fakeAlert
      });
      const mockDispatch = jest.fn();
      const mockMoment = moment.tz('Asia/Tokyo').startOf('day');
      const promise = Actions.getNewActivity(mockMoment)(mockDispatch, getBasicState);
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
        payload: {setFocusAfterLoad: false},
      }));
      // GOT_ITEMS_SUCCESS is dispatched by the action when internal promise is fulfulled
    });

    it('calls alert on error', () => {
      const fakeAlert = jest.fn();
      alertInitialize({
        visualErrorCallback: fakeAlert
      });
      const mockDispatch = jest.fn();
      const fetchPromise = Actions.loadFutureItems()(mockDispatch, getBasicState);
      return moxiosRespond(
        { some: 'response data' },
        fetchPromise,
        { status: 500 }
      ).then((result) => {
        expect(fakeAlert).toHaveBeenCalled();
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

    it('resolves the promise with transformed response data', () => {
      const mockDispatch = jest.fn();
      const fetchPromise = Actions.loadFutureItems()(mockDispatch, getBasicState);
      return moxiosRespond([{some: 'response'}], fetchPromise).then(result => {
        expect(result).toMatchObject([{some: 'response', transformedToInternal: true}]);
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
  });

  describe('loadPastUntilNewActivity', () => {
    it('dispatches getting past items', () => {
      const mockDispatch = jest.fn();
      Actions.loadPastUntilNewActivity()(mockDispatch, (getBasicState));
      expect(mockDispatch).toHaveBeenCalledWith({type: 'GETTING_PAST_ITEMS', payload: {seekingNewActivity: true}});
    });

    it('sends a fetch with the past url', () => {
      const mockDispatch = jest.fn();
      const state = getBasicState();
      state.loading.pastNextUrl = 'some-past-url';
      Actions.loadPastUntilNewActivity()(mockDispatch, () => state);
      return moxiosWait((request) => {
        expect(request.url).toBe('some-past-url');
      });
    });

    it('appends to pending and redispatches itself if result is no new activity', () => {
      const mockDispatch = jest.fn();
      const fetchPromise = Actions.loadPastUntilNewActivity()(mockDispatch, getBasicState);
      return moxiosRespond([{some: 'item', status: {}}], fetchPromise, {headers: {link: '<next-past-url>; rel="next"'}})
      .then((response) => {
        expect(mockDispatch).toHaveBeenCalledWith(expect.objectContaining({
          type: 'ADD_PENDING_PAST_ITEMS',
          payload: expect.objectContaining({
            internalItems: [{some: 'item', status: {}, transformedToInternal: true}],
          }),
        }));
        // assume dispatching a function is it dispatching its thunk
        expect(typeof mockDispatch.mock.calls[2][0]).toBe('function');
      });
    });

    it('dispatches loading new items actions when result has new activity', () => {
      const mockDispatch = jest.fn();
      const state = getBasicState();
      state.pendingItems.past = [{some: 'past'}];
      const fetchPromise = Actions.loadPastUntilNewActivity()(mockDispatch, () => state);
      const response = ([{some: 'new-item', status: {new_replies: true}}]);
      return moxiosRespond(response, fetchPromise, {headers: {link: '<next-past-url>; rel="next"'}})
      .then((response) => {
        expect(mockDispatch).toHaveBeenCalledWith(expect.objectContaining({type: 'ADD_PENDING_PAST_ITEMS'}));
        // note: this just makes sure the past items are added. The past doesn't include the newItem
        // because our mockDispatch doesn't invoke the reducers that add the new-item to the past.
        expect(mockDispatch).toHaveBeenCalledWith(expect.objectContaining({
          type: 'GOT_ITEMS_SUCCESS',
          payload: expect.objectContaining({
            internalItems: [{some: 'past'}],
          }),
        }));
        expect(mockDispatch).toHaveBeenCalledWith({type: 'FLUSH_PENDING_PAST_ITEMS'});
      });
    });

  });
});
