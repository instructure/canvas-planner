import pendingReducer from '../pending-items-reducer';

it('appends past items', () => {
  const initialState = {past: [{existing: 'item'}], future: []};
  const newState = pendingReducer(initialState, {type: 'ADD_PENDING_PAST_ITEMS', payload: {
    internalItems: [{first: 'item'}, {second: 'item'}],
  }});
  expect(newState).toEqual({
    future: [],
    past: [
      {existing: 'item'},
      {first: 'item'},
      {second: 'item'},
    ],
  });
});

it('flushes past items', () => {
  const initialState = {past: [{existing: 'item'}], future: [{future: 'item'}]};
  const newState = pendingReducer(initialState, {type: 'FLUSH_PENDING_PAST_ITEMS'});
  expect(newState).toEqual({
    future: [{future: 'item'}],
    past: [],
  });
});
