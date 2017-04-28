import itemsReducer from '../items-reducer';

it('adds items to the state on GOT_ITEMS_SUCCESS', () => {
  const initialState = [];

  const newState = itemsReducer(initialState, {
    type: 'GOT_ITEMS_SUCCESS',
    payload: [{ date: '2017-04-28' }, { date: '2017-04-29' }]
  });

  expect(newState.length).toBe(2);
});
