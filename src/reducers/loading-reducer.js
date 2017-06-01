import { handleActions } from 'redux-actions';
import { formatDayKey } from '../utilities/dateUtils';

function loadingState (currentState, loadingState) {
  return {
    ...currentState,
    isLoading: false,
    loadingPast: false,
    loadingFuture: false,
    // the "all loaded" properties should retain their current values unless loadingState sets them
    ...loadingState,
  };
}

function gotItemsSuccess (state, action) {
  const newItems = action.payload;
  let firstNewDayKey = null;
  let setFocusAfterLoad = false;
  if (state.loadingFuture && state.setFocusAfterLoad) {
    setFocusAfterLoad = true;
    if (newItems.length) {
      firstNewDayKey = formatDayKey(newItems[0].dateBucketMoment);
    }
  }
  return loadingState(state, {firstNewDayKey, setFocusAfterLoad});
}

export default handleActions({
  GOT_ITEMS_SUCCESS: gotItemsSuccess,
  START_LOADING_ITEMS: (state, action) => {
    return loadingState(state, {isLoading: true});
  },
  GETTING_PAST_ITEMS: (state, action) => {
    return loadingState(state, {loadingPast: true});
  },
  GETTING_FUTURE_ITEMS: (state, action) => {
    return loadingState(state, {loadingFuture: true, setFocusAfterLoad: action.payload.setFocusAfterLoad});
  },
  ALL_FUTURE_ITEMS_LOADED: (state, action) => {
    return loadingState(state, {allFutureItemsLoaded: true, setFocusAfterLoad: false});
  },
  ALL_PAST_ITEMS_LOADED: (state, action) => {
    return loadingState(state, {allPastItemsLoaded: true});
  }
}, loadingState({}, {
  allPastItemsLoaded: false,
  allFutureItemsLoaded: false,
  setFocusAfterLoad: false,
  firstNewDayKey: null,
}));
