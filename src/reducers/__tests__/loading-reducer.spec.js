import moment from 'moment-timezone';
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

it('sets loadingFuture to true on GETTING_FUTURE_ITEMS', () => {
  const newState = loadingReducer({}, {
    type: 'GETTING_FUTURE_ITEMS',
    payload: { setFocusAfterLoad: false },
  });

  expect(newState).toMatchObject({
    loadingFuture: true
  });
});

it('sets loading to false on GOT_ITEMS_SUCCESS', () => {
  const initialState = { isLoading: true };
  const newState = loadingReducer(initialState, {
    type: 'GOT_ITEMS_SUCCESS'
  });

  expect(newState).toMatchObject({
    isLoading: false,
    loadingPast: false,
    loadingFuture: false,
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

it('sets all future items loaded and nothing loading', () => {
  const initialState = {
    isLoading: true, loadingPast: true, loadingFuture: true,
    allFutureItemsLoaded: false, allPastItemsLoaded: false,
  };
  const newState = loadingReducer(initialState, {type: 'ALL_FUTURE_ITEMS_LOADED'});
  expect(newState).toMatchObject({
    isLoading: false, loadingPast: false, loadingFuture: false,
    allFutureItemsLoaded: true, allPastItemsLoaded: false,
  });
});

it('sets all past items loaded and nothing loading', () => {
  const initialState = {
    isLoading: true, loadingPast: true, loadingFuture: true,
    allFutureItemsLoaded: false, allPastItemsLoaded: false,
  };
  const newState = loadingReducer(initialState, {type: 'ALL_PAST_ITEMS_LOADED'});
  expect(newState).toMatchObject({
    isLoading: false, loadingPast: false, loadingFuture: false,
    allFutureItemsLoaded: false, allPastItemsLoaded: true,
  });
});

it('sets setFocusAfterLoad when it is specified as an option to the action', () => {
  const initialState = {setFocusAfterLoad: false};
  const newState = loadingReducer(initialState, {type: 'GETTING_FUTURE_ITEMS', payload: {setFocusAfterLoad: true}});
  expect(newState).toMatchObject({setFocusAfterLoad: true});
});

it('sets firstNewDayKey and preserves setFocusAfterLoad when load more button was pressed and loading future items finishes', () => {
  const initialState = {
    setFocusAfterLoad: true,
    loadingFuture: true,
  };
  const newState = loadingReducer(initialState, {type: 'GOT_ITEMS_SUCCESS', payload: [
    {dateBucketMoment: moment.tz('2017-06-08', 'Asia/Tokyo')},
  ]});
  expect(newState).toMatchObject({
    firstNewDayKey: '2017-06-08',
    setFocusAfterLoad: true,
    loadingFuture: false,
  });
});

it('keeps setFocusAfterLoad even when no items were loaded', () => {
  const initialState = {
    setFocusAfterLoad: true,
    loadingFuture: true,
  };
  const newState = loadingReducer(initialState, {type: 'GOT_ITEMS_SUCCESS', payload: []});
  expect(newState).toMatchObject({
    setFocusAfterLoad: true,
  });
});

it('clears setFocusAfterLoad when all future items are loaded', () => {
  const initialState = {
    setFocusAfterLoad: true,
  };
  const newState = loadingReducer(initialState, {type: 'ALL_FUTURE_ITEMS_LOADED'});
  expect(newState).toMatchObject({setFocusAfterLoad: false});
});

it('clears firstNewDayKey when load more button was not pressed', () => {
  const initialState = {
    setFocusAfterLoad: false,
    loadingFuture: true,
    firstNewDayKey: '2017-06-08',
  };
  const newState = loadingReducer(initialState, {type: 'GOT_ITEMS_SUCCESS', payload: [
    {dateBucketMoment: moment.tz('2017-06-08', 'Asia/Tokyo')},
  ]});
  expect(newState.firstNewDayKey).not.toEqual(expect.anything());
});

it('clears firstNewDayKey and setFocusAfterLoad when not loading future', () => {
  const initialState = {
    setFocusAfterLoad: true,
    loadingFuture: false,
    firstNewDayKey: '2017-06-08',
  };
  const newState = loadingReducer(initialState, {type: 'GOT_ITEMS_SUCCESS', payload: [
    {dateBucketMoment: moment.tz('2017-06-08', 'Asia/Tokyo')},
  ]});
  expect(newState).toMatchObject({
    setFocusAfterLoad: false,
    firstNewDayKey: null,
  });
});
