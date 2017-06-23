import * as Actions from '../index';
import moxios from 'moxios';
import moment from 'moment-timezone';
import {isPromise, moxiosWait, moxiosRespond} from '../../test-utils';
import { initialize as alertInitialize } from '../../utilities/alertUtils';

jest.mock('../../utilities/apiUtils', () => ({
  transformApiToInternalItem: jest.fn(response => ({...response, transformedToInternal: true})),
  transformInternalToApiItem: jest.fn(internal => ({...internal, transformedToApi: true})),
  transformInternalToApiOverride: jest.fn(internal => ({...internal.planner_override, marked_complete: null, transformedToApiOverride: true})),
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
  userId: '1',
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

describe('getOpportunities', () => {
  it('dispatches startLoading and addOpportunities actions', (done) => {
    const mockDispatch = jest.fn();
    Actions.getOpportunities()(mockDispatch, getBasicState);
    expect(mockDispatch).toHaveBeenCalledWith({type: 'START_LOADING_OPPORTUNITIES'});
    moxios.wait(() => {
      let request = moxios.requests.mostRecent();
      request.respondWith({
        status: 200,
        response: [
          { id: 1, firstName: 'Fred', lastName: 'Flintstone' },
          { id: 2, firstName: 'Wilma', lastName: 'Flintstone' }
        ]
      }).then(() => {
        expect(mockDispatch).toHaveBeenCalledWith({type: 'ADD_OPPORTUNITIES', payload: [
          { id: 1, firstName: 'Fred', lastName: 'Flintstone' },
          { id: 2, firstName: 'Wilma', lastName: 'Flintstone' }
        ]});
        done();
      });
    });
  });

  it('dispatches startDismissingOpportunity and dismissedOpportunity actions', (done) => {
    const mockDispatch = jest.fn();
    Actions.dismissOpportunity("6")(mockDispatch, getBasicState);
    expect(mockDispatch).toHaveBeenCalledWith({"payload": "6", "type": "START_DISMISSING_OPPORTUNITY"});
    moxios.wait(() => {
      let request = moxios.requests.mostRecent();
      request.respondWith({
        status: 201,
        response: [
          { id: 1, firstName: 'Fred', lastName: 'Flintstone' },
          { id: 2, firstName: 'Wilma', lastName: 'Flintstone' }
        ]
      }).then(() => {
        expect(mockDispatch).toHaveBeenCalledWith({type: 'DISMISSED_OPPORTUNITY', payload: [
          { id: 1, firstName: 'Fred', lastName: 'Flintstone' },
          { id: 2, firstName: 'Wilma', lastName: 'Flintstone' }
        ]});
        done();
      });
    });
  });

  it('dispatches startDismissingOpportunity and dismissedOpportunity actions when given override', (done) => {
    const mockDispatch = jest.fn();
    Actions.dismissOpportunity("6", {id: "6"})(mockDispatch, getBasicState);
    expect(mockDispatch).toHaveBeenCalledWith({"payload": "6", "type": "START_DISMISSING_OPPORTUNITY"});
    moxios.wait(() => {
      let request = moxios.requests.mostRecent();
      request.respondWith({
        status: 201,
        response: [
          { id: 1, firstName: 'Fred', lastName: 'Flintstone' },
          { id: 2, firstName: 'Wilma', lastName: 'Flintstone' }
        ]
      }).then(() => {
        expect(mockDispatch).toHaveBeenCalledWith({type: 'DISMISSED_OPPORTUNITY', payload: [
          { id: 1, firstName: 'Fred', lastName: 'Flintstone' },
          { id: 2, firstName: 'Wilma', lastName: 'Flintstone' }
        ]});
        done();
      });
    });
  });

  it('calls the alert function when a failure occurs', (done) => {
    const mockDispatch = jest.fn();
    const fakeAlert = jest.fn();
    alertInitialize({
      visualErrorCallback: fakeAlert
    });
    Actions.getOpportunities()(mockDispatch, getBasicState);
    moxios.wait(() => {
      let request = moxios.requests.mostRecent();
      request.respondWith({
        status: 500,
      }).then(() => {
        expect(fakeAlert).toHaveBeenCalled();
        done();
      });
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

    it('sends transformed data in the request', () => {
      const mockDispatch = jest.fn();
      const plannerItem = {some: 'data'};
      Actions.savePlannerItem(plannerItem)(mockDispatch, getBasicState);
      return moxiosWait(request => {
        expect(JSON.parse(request.config.data)).toMatchObject({some: 'data', transformedToApi: true});
      });
    });

    it('resolves the promise with transformed response data', () => {
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
        expect(request.url).toBe('api/v1/planner_notes');
        expect(JSON.parse(request.config.data)).toMatchObject({some: 'data', transformedToApi: true});
      });
    });

    it('does set default time of 11:59 pm for planner date', () => {
      const plannerItem = {date: moment('2017-06-22T10:05:54').tz("Atlantic/Azores").format()};
      Actions.savePlannerItem(plannerItem)(() => {});
      return moxiosWait((request) => {
        expect(request.config.method).toBe('post');
        expect(request.url).toBe('api/v1/planner_notes');
        expect(JSON.parse(request.config.data).transformedToApi).toBeTruthy();
        expect(moment(JSON.parse(request.config.data).date).tz("Atlantic/Azores").format()).toBe(moment('2017-06-22T23:59:59').tz("Atlantic/Azores").format());
      });
    });

    it('does a put if the planner item exists (has id)', () => {
      const plannerItem = {id: '42', some: 'data'};
      Actions.savePlannerItem(plannerItem, )(() => {});
      return moxiosWait((request) => {
        expect(request.config.method).toBe('put');
        expect(request.url).toBe('api/v1/planner_notes/42');
        expect(JSON.parse(request.config.data)).toMatchObject({id: '42', some: 'data', transformedToApi: true});
      });
    });

    it('calls the alert function when a failure occurs', () => {
      const fakeAlert = jest.fn();
      const mockDispatch = jest.fn();
      alertInitialize({
        visualErrorCallback: fakeAlert
      });

      const plannerItem = {some: 'data'};
      const savePromise = Actions.savePlannerItem(plannerItem)(mockDispatch, getBasicState);
      return moxiosRespond(
        { some: 'response data' },
        savePromise,
        { status: 500 }
      ).then((result) => {
        expect(fakeAlert).toHaveBeenCalled();
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
        expect(request.url).toBe('api/v1/planner_notes/42');
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

    it('calls the alert function when a failure occurs', () => {
      const fakeAlert = jest.fn();
      const mockDispatch = jest.fn();
      alertInitialize({
        visualErrorCallback: fakeAlert
      });

      const plannerItem = { some: 'data' };
      const deletePromise = Actions.deletePlannerItem(plannerItem)(mockDispatch, getBasicState);
      return moxiosRespond(
        { some: 'response data' },
        deletePromise,
        { status: 500 }
      ).then((result) => {
        expect(fakeAlert).toHaveBeenCalled();
      });
    });
  });

  describe('togglePlannerItemCompletion', () => {
    it('dispatches saving and saved actions', () => {
      const mockDispatch = jest.fn();
      const plannerItem = {some: 'data'};
      const savePromise = Actions.togglePlannerItemCompletion(plannerItem)(mockDispatch, getBasicState);
      expect(isPromise(savePromise)).toBe(true);
      expect(mockDispatch).toHaveBeenCalledWith({type: 'SAVING_PLANNER_ITEM', payload: plannerItem});
      expect(mockDispatch).toHaveBeenCalledWith({type: 'SAVED_PLANNER_ITEM', payload: savePromise});
    });

    it ('updates marked_complete and sends override data in the request', () => {
      const mockDispatch = jest.fn();
      const plannerItem = {some: 'data', marked_complete: null};
      Actions.togglePlannerItemCompletion(plannerItem)(mockDispatch, getBasicState);
      return moxiosWait(request => {
        expect(JSON.parse(request.config.data)).toMatchObject({marked_complete: true, transformedToApiOverride: true});
      });
    });

    it('does a post if the planner override is new (no id)', () => {
      const mockDispatch = jest.fn();
      const plannerItem = {id: '42', some: 'data'};
      Actions.togglePlannerItemCompletion(plannerItem)(mockDispatch, getBasicState);
      return moxiosWait((request) => {
        expect(request.config.method).toBe('post');
        expect(request.url).toBe('api/v1/planner/overrides');
        expect(JSON.parse(request.config.data)).toMatchObject({marked_complete: true, transformedToApiOverride: true});
      });
    });

    it('does a put if the planner override exists (has id)', () => {
      const mockDispatch = jest.fn();
      const plannerItem = {id: '42', some: 'data', planner_override: {id: '5', marked_complete: true}};
      Actions.togglePlannerItemCompletion(plannerItem)(mockDispatch, getBasicState);
      return moxiosWait((request) => {
        expect(request.config.method).toBe('put');
        expect(request.url).toBe('api/v1/planner/overrides/5');
        expect(JSON.parse(request.config.data)).toMatchObject({id: '5', marked_complete: true, transformedToApiOverride: true});
      });
    });

    it ('resolves the promise with override response data in the item', () => {
      const mockDispatch = jest.fn();
      const plannerItem = {some: 'data', planner_override: {id: 'override_id', marked_complete: true}};
      const togglePromise = Actions.togglePlannerItemCompletion(plannerItem)(mockDispatch, getBasicState);
      return moxiosRespond(
        {some: 'response data', id: 'override_id', marked_complete: false },
        togglePromise
      ).then((result) => {
        expect(result).toMatchObject({
          ...plannerItem,
          completed: false,
          overrideId: 'override_id',
          show: true,
        });
      });
    });
  });
});
