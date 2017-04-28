import rootReducer from '../index';

it('sets the default state for all properties empty initial state', () => {
  const newState = rootReducer({}, { type: 'FAKE_ACTION' });
  expect(newState).toMatchObject({
    items: [],
    days: {},
    loading: {
      isLoading: false
    }
  });
});
