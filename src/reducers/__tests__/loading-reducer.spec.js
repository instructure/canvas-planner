import loadingReducer from '../loading-reducer';

it('sets loading to true on START_LOADING_ITEMS', () => {
  const newState = loadingReducer({}, {
    type: 'START_LOADING_ITEMS'
  });

  expect(newState).toMatchObject({
    isLoading: true
  });
});

it('sets loading to false on GOT_ITEMS_SUCCESS', () => {
  const initialState = { isLoading: true };
  const newState = loadingReducer(initialState, {
    type: 'GOT_ITEMS_SUCCESS'
  });

  expect(newState).toMatchObject({
    isLoading: false
  });
});
