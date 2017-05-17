import * as Actions from '../index';
import moxios from 'moxios';
import moment from 'moment';

import {isPromise, moxiosWait} from '../../test-utils';

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
      thunk(fakeDispatch);
      expect(fakeDispatch.mock.calls[0][0]).toMatchObject({
        type: 'START_LOADING_ITEMS'
      });
    });
  });

  describe('savePlannerItem', () => {
    it('dispatches saving and saved actions', () => {
      const mockDispatch = jest.fn();
      const plannerItem = {some: 'data'};
      const savePromise = Actions.savePlannerItem(plannerItem)(mockDispatch);
      expect(isPromise(savePromise)).toBe(true);
      expect(mockDispatch).toHaveBeenCalledWith({type: 'SAVING_PLANNER_ITEM', payload: plannerItem});
      expect(mockDispatch).toHaveBeenCalledWith({type: 'SAVED_PLANNER_ITEM', payload: savePromise});
    });

    it('does a post if the planner item is new (no id)', () => {
      const plannerItem = {some: 'data'};
      Actions.savePlannerItem(plannerItem)(() => {});
      return moxiosWait((request) => {
        expect(request.config.method).toBe('post');
        expect(request.url).toBe('api/v1/planner/items');
        expect(JSON.parse(request.config.data)).toEqual(plannerItem);
      });
    });

    it('does a put if the planner item exists (has id)', () => {
      const plannerItem = {id: '42', some: 'data'};
      Actions.savePlannerItem(plannerItem, )(() => {});
      return moxiosWait((request) => {
        expect(request.config.method).toBe('put');
        expect(request.url).toBe('api/v1/planner/items/42');
        expect(JSON.parse(request.config.data)).toEqual(plannerItem);
      });
    });
  });

  describe('deletePlannerItem', () => {
    it('dispatches deleting and deleted actions', () => {
      const mockDispatch = jest.fn();
      const plannerItem = {some: 'data'};
      const savePromise = Actions.savePlannerItem(plannerItem)(mockDispatch);
      expect(isPromise(savePromise)).toBe(true);
      expect(mockDispatch).toHaveBeenCalledWith({type: 'SAVING_PLANNER_ITEM', payload: plannerItem});
      expect(mockDispatch).toHaveBeenCalledWith({type: 'SAVED_PLANNER_ITEM', payload: savePromise});
    });

    it('sends a delete request for the item id', () => {
      const plannerItem = {id: '42', some: 'data'};
      Actions.deletePlannerItem(plannerItem, )(() => {});
      return moxiosWait((request) => {
        expect(request.config.method).toBe('delete');
        expect(request.url).toBe('api/v1/planner/items/42');
      });

    });
  });
});
