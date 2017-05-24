import * as Actions from '../index';
import moxios from 'moxios';
import moment from 'moment';
import {isPromise, moxiosWait, moxiosRespond} from '../../test-utils';

jest.mock('../../utilities/apiUtils', () => ({
  transformApiToInternalItem: jest.fn(response => ({...response, transformedToInternal: true})),
  transformInternalToApiItem: jest.fn(internal => ({...internal, transformedToApi: true})),
}));

const getBasicState = () => ({
  courses: [],
  timeZone: 'UTC',
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
});
