import loadingReducer from '../loading-reducer';

it('sets loading to true on START_LOADING_ITEMS', () => {
  const newState = loadingReducer({}, {
    type: 'START_LOADING_ITEMS'
  });

  expect(newState).toMatchObject({
    isLoading: true
  });
});

it('sets loadingPast to true on GETTING_PAST_ITEMS', () => {
  const newState = loadingReducer({}, {
    type: 'GETTING_PAST_ITEMS'
  });

  expect(newState).toMatchObject({
    loadingPast: true
  });
});

it('sets loading to false on GOT_ITEMS_SUCCESS', () => {
  const initialState = { isLoading: true };
  const newState = loadingReducer(initialState, {
    type: 'GOT_ITEMS_SUCCESS'
  });

  expect(newState).toMatchObject({
    isLoading: false,
  });
});

it('sets loadingPast to false on GOT_ITEMS_SUCCESS', () => {
  const initialState = { loadingPast: true };
  const newState = loadingReducer(initialState, {
    type: 'GOT_ITEMS_SUCCESS'
  });

  expect(newState).toMatchObject({
    loadingPast: false,
  });
});
