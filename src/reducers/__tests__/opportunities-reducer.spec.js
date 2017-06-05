import opportunitiesReducer from '../opportunities-reducer';

it('adds items to the state on ADD_OPPORTUNITIES', () => {
  const initialState = [];

  const newState = opportunitiesReducer(initialState, {
    type: 'ADD_OPPORTUNITIES',
    payload: [{ date: '2017-04-28' }, { date: '2017-04-29' }]
  });

  expect(newState.length).toBe(2);
});
