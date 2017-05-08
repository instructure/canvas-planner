import daysReducer from '../days-reducer';
import moment from 'moment';

it('groups items by day on GOT_ITEMS_SUCCESS', () => {
  const initialState = {};

  const dayOne = moment('2017-04-27').format();
  const dayTwo = moment('2017-04-28').format();

  const newState = daysReducer(initialState, {
    type: 'GOT_ITEMS_SUCCESS',
    payload: [{ date: dayOne }, { date: dayTwo }]
  });

  expect(newState).toMatchObject({
    '2017-04-27': [{ date: dayOne }],
    '2017-04-28': [{ date: dayTwo }]
  });
});

it('adds a new day on ADD_DAY', () => {
  const initialState = {
    '2017-04-27': [],
    '2017-04-26': []
  };

  const newState = daysReducer(initialState, {
    type: 'ADD_DAY',
    payload: '2017-04-29'
  });

  expect(newState).toMatchObject({
    '2017-04-27': [],
    '2017-04-26': [],
    '2017-04-29': []
  });
});

describe('saving planner items', () => {
  it('adds new items to the day', () => {
    const initialState = {
      '2017-04-27': [{date: '2017-04-27', id: '42'}],
    };
    const newState = daysReducer(initialState, {
      type: 'SAVED_PLANNER_ITEM',
      payload: {data: {date: '2017-04-27', id: '43'}},
    });
    expect(newState).toMatchObject({
      '2017-04-27': [{date: '2017-04-27', id: '42'}, {date: '2017-04-27', id: '43'}],
    });
  });

  it('merges new data into existing items', () => {
    const initialState = {
      '2017-04-27': [{date: '2017-04-27', id: '42', title: 'an event'}],
    };
    const newState = daysReducer(initialState, {
      type: 'SAVED_PLANNER_ITEM',
      payload: {data: {date: '2017-04-27', id: '42', title: 'renamed event'}},
    });
    expect(newState).toMatchObject({
      '2017-04-27': [{date: '2017-04-27', id: '42', title: 'renamed event'}],
    });
  });

  it('does nothing if the date is not loaded', () => {
    const initialState = {
      '2017-04-27': [{date: '2017-04-27', id: '42'}],
    };
    const newState = daysReducer(initialState, {
      type: 'SAVED_PLANNER_ITEM',
      payload: {data: {date: '2017-04-28', id: '43'}},
    });
    expect(newState).toBe(initialState);
  });

  it('does not add anything if the action is an error', () => {
    const initialState = {
      '2017-04-27': [{date: '2017-04-27', id: '42'}],
    };
    const newState = daysReducer(initialState, {
      type: 'SAVED_PLANNER_ITEM',
      payload: {data: {date: '2017-04-27', id: '43'}},
      error: true,
    });
    expect(newState).toBe(initialState);
  });
});

describe('deleting planner items', () => {
  it('removes planner items', () => {
    const initialState = {
      '2017-04-27': [{id: '42'}, {id: '43'}],
      '2017-04-28': [{id: '44'}, {id: '45'}, {id: '46'}],
      '2017-04-29': [{id: '47'}, {id: '48'}]
    };
    const newState = daysReducer(initialState, {
      type: 'DELETED_PLANNER_ITEM',
      payload: {data: {date: '2017-04-28T00:00:00', id: '45'}},
    });
    expect(newState).toMatchObject({
      '2017-04-27': [{id: '42'}, {id: '43'}],
      '2017-04-28': [{id: '44'}, {id: '46'}],
      '2017-04-29': [{id: '47'}, {id: '48'}],
    });
  });

  it('does nothing if the deleted item is not loaded', () => {
    const initialState = {
      '2017-04-27': [{id: '42'}, {id: '43'}],
      '2017-04-28': [{id: '44'}, {id: '45'}, {id: '46'}],
      '2017-04-29': [{id: '47'}, {id: '48'}]
    };
    const newState = daysReducer(initialState, {
      type: 'DELETED_PLANNER_ITEM',
      payload: {data: {date: '2017-05-01T00:00:00', id: '52'}},
    });
    expect(newState).toBe(initialState);
  });

  it('does nothing if the deleted action fails', () => {
    const initialState = {
      '2017-04-28': [{id: '44'}, {id: '45'}, {id: '46'}],
    };
    const newState = daysReducer(initialState, {
      type: 'DELETED_PLANNER_ITEM',
      payload: {data: {date: '2017-04-28T00:00:00', id: '45'}},
      error: true,
    });
    expect(newState).toBe(initialState);
  });
});
