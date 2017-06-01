import * as Actions from '../index';
import moxios from 'moxios';
import moment from 'moment-timezone';
import {isPromise, moxiosWait, moxiosRespond} from '../../test-utils';

jest.mock('../../utilities/apiUtils', () => ({
  transformApiToInternalItem: jest.fn(response => ({...response, transformedToInternal: true})),
  transformInternalToApiItem: jest.fn(internal => ({...internal, transformedToApi: true})),
}));

const getBasicState = () => ({
  courses: [],
  timeZone: 'UTC',
  days: [
    ['2017-05-24', [{id: '42', dateBucketMoment: moment.tz('2017-05-24', 'UTC')}]],
  ],
});

describe('api actions', () => {
  beforeEach(() => {
    moxios.install();
  });

  afterEach(() => {
    moxios.uninstall();
  });

  describe('getPlannerItems', () => {
    it('dispatches startLoadingItems() initially', () => {
      const thunk = Actions.getPlannerItems(moment());
      const fakeDispatch = jest.fn();
      thunk(fakeDispatch, getBasicState);
      expect(fakeDispatch.mock.calls[0][0]).toMatchObject({
        type: 'START_LOADING_ITEMS'
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

  describe('savePlannerItem', () => {
    it('dispatches saving and saved actions', () => {
      const mockDispatch = jest.fn();
      const plannerItem = {some: 'data'};
      const savePromise = Actions.savePlannerItem(plannerItem)(mockDispatch, getBasicState);
      expect(isPromise(savePromise)).toBe(true);
      expect(mockDispatch).toHaveBeenCalledWith({type: 'SAVING_PLANNER_ITEM', payload: plannerItem});
      expect(mockDispatch).toHaveBeenCalledWith({type: 'SAVED_PLANNER_ITEM', payload: savePromise});
    });

    it ('sends transformed data in the request', () => {
      const mockDispatch = jest.fn();
      const plannerItem = {some: 'data'};
      Actions.savePlannerItem(plannerItem)(mockDispatch, getBasicState);
      return moxiosWait(request => {
        expect(JSON.parse(request.config.data)).toMatchObject({some: 'data', transformedToApi: true});
      });
    });

    it ('resolves the promise with transformed response data', () => {
      const mockDispatch = jest.fn();
      const plannerItem = {some: 'data'};
      const savePromise = Actions.savePlannerItem(plannerItem)(mockDispatch, getBasicState);
      return moxiosRespond(
        { some: 'response data' },
        savePromise
      ).then((result) => {
        expect(result).toMatchObject({
          some: 'response data', transformedToInternal: true,
        });
      });
    });

    it('does a post if the planner item is new (no id)', () => {
      const plannerItem = {some: 'data'};
      Actions.savePlannerItem(plannerItem)(() => {});
      return moxiosWait((request) => {
        expect(request.config.method).toBe('post');
        expect(request.url).toBe('api/v1/planner/items');
        expect(JSON.parse(request.config.data)).toMatchObject({some: 'data', transformedToApi: true});
      });
    });

    it('does a put if the planner item exists (has id)', () => {
      const plannerItem = {id: '42', some: 'data'};
      Actions.savePlannerItem(plannerItem, )(() => {});
      return moxiosWait((request) => {
        expect(request.config.method).toBe('put');
        expect(request.url).toBe('api/v1/planner/items/42');
        expect(JSON.parse(request.config.data)).toMatchObject({id: '42', some: 'data', transformedToApi: true});
      });
    });
  });

  describe('deletePlannerItem', () => {
    it('dispatches deleting and deleted actions', () => {
      const mockDispatch = jest.fn();
      const plannerItem = {some: 'data'};
      const deletePromise = Actions.deletePlannerItem(plannerItem)(mockDispatch, getBasicState);
      expect(isPromise(deletePromise)).toBe(true);
      expect(mockDispatch).toHaveBeenCalledWith({type: 'DELETING_PLANNER_ITEM', payload: plannerItem});
      expect(mockDispatch).toHaveBeenCalledWith({type: 'DELETED_PLANNER_ITEM', payload: deletePromise});
    });

    it('sends a delete request for the item id', () => {
      const plannerItem = {id: '42', some: 'data'};
      Actions.deletePlannerItem(plannerItem, )(() => {});
      return moxiosWait((request) => {
        expect(request.config.method).toBe('delete');
        expect(request.url).toBe('api/v1/planner/items/42');
      });
    });

    it('resolves the promise with transformed response data', () => {
      const mockDispatch = jest.fn();
      const plannerItem = {some: 'data'};
      const deletePromise = Actions.deletePlannerItem(plannerItem)(mockDispatch, getBasicState);
      return moxiosRespond(
        { some: 'response data' },
        deletePromise
      ).then((result) => {
        expect(result).toMatchObject({some: 'response data', transformedToInternal: true});
      });
    });
  });

  describe('loadFutureItems', () => {
    it('dispatches loading actions', () => {
      const mockDispatch = jest.fn();
      const fetchPromise = Actions.loadFutureItems()(mockDispatch, getBasicState);
      expect(isPromise(fetchPromise));
      expect(mockDispatch).toHaveBeenCalledWith(expect.objectContaining({type: 'GETTING_FUTURE_ITEMS'}));
      // GOT_ITEMS_SUCCESS is dispatched by the action when internal promise is fulfulled
    });

    it('sends the due_after parameter as one day after the last day', () => {
      const mockDispatch = jest.fn();
      const numDays = getBasicState().days.length;
      const afterMoment = getBasicState().days[numDays-1][1][0].dateBucketMoment
        .clone().add(1, 'days');
      Actions.loadFutureItems()(mockDispatch, getBasicState);
      return moxiosWait((request) => {
        expect(moment(request.config.params.due_after).isSame(afterMoment)).toBeTruthy();
      });
    });

    it('resolves the promise with transformed response data', () => {
      const mockDispatch = jest.fn();
      const fetchPromise = Actions.loadFutureItems()(mockDispatch, getBasicState);
      return moxiosRespond([{some: 'response'}], fetchPromise).then(result => {
        expect(result).toMatchObject([{some: 'response', transformedToInternal: true}]);
        expect(mockDispatch).toHaveBeenCalledWith({type: 'GOT_ITEMS_SUCCESS',
          payload: [{some: 'response', transformedToInternal: true}]});
      });
    });

    it('dispatches all future items loaded if no items loaded', () => {
      const mockDispatch = jest.fn();
      const fetchPromise = Actions.loadFutureItems()(mockDispatch, getBasicState);
      return moxiosRespond([], fetchPromise).then(result => {
        expect(mockDispatch).toHaveBeenCalledWith({type: 'ALL_FUTURE_ITEMS_LOADED'});
      });
    });
  });

  describe('scrollIntoPast', () => {
    it('dispatches scrolling and got items actions', () => {
      const mockDispatch = jest.fn();
      const scrollPromise = Actions.scrollIntoPast()(mockDispatch, getBasicState);
      expect(isPromise(scrollPromise));
      expect(mockDispatch).toHaveBeenCalledWith({type: 'GETTING_PAST_ITEMS'});
      expect(mockDispatch).toHaveBeenCalledWith({type: 'GOT_ITEMS_SUCCESS', payload: scrollPromise});
    });

    it('sends due_before parameter', () => {
      const mockDispatch = jest.fn();
      const beforeMoment = getBasicState().days[0][1][0].dateBucketMoment;
      Actions.scrollIntoPast()(mockDispatch, getBasicState);
      return moxiosWait((request) => {
        expect(moment(request.config.params.due_before).isSame(beforeMoment)).toBeTruthy();
      });
    });

    it('resolves the promise with transformed response data', () => {
      const mockDispatch = jest.fn();
      const scrollPromise = Actions.scrollIntoPast()(mockDispatch, getBasicState);
      return moxiosRespond([{some: 'response'}], scrollPromise).then(result => {
        expect(result).toMatchObject([{some: 'response', transformedToInternal: true}]);
      });
    });

    it('dispatches all past items loaded if no past items were loaded', () => {
      const mockDispatch = jest.fn();
      const fetchPromise = Actions.scrollIntoPast()(mockDispatch, getBasicState);
      return moxiosRespond([], fetchPromise).then(result => {
        expect(mockDispatch).toHaveBeenCalledWith({type: 'ALL_PAST_ITEMS_LOADED'});
      });
    });
  });
});
