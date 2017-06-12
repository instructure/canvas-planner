import { handleActions } from 'redux-actions';
import parseLinkHeader from 'parse-link-header';
import { formatDayKey } from '../utilities/dateUtils';
import { anyNewActivity } from '../utilities/statusUtils';

function loadingState (currentState, loadingState) {
  return {
    ...currentState,
    isLoading: false,
    loadingPast: false,
    loadingFuture: false,
    // all other properties should retain their current values unless loadingState sets them
    ...loadingState,
  };
}

function findNextLink (state, action) {
  const response = action.payload.response;
  if (response == null) return null;

  const linkHeader = response.headers.link;
  if (linkHeader == null) return null;

  const parsedLinks = parseLinkHeader(linkHeader);
  if (parsedLinks == null) return null;

  if (parsedLinks.next == null) return null;
  return parsedLinks.next.url;
}

function getNextUrls (state, action) {
  const linkState = {};
  const nextLink = findNextLink(state, action);

  if (state.isLoading || state.loadingFuture) linkState.futureNextUrl = nextLink;
  if (state.loadingPast) linkState.pastNextUrl = nextLink;

  return linkState;
}

function determineFocusAfterLoad (state, action) {
  const newItems = action.payload.internalItems;
  let firstNewDayKey = null;
  let setFocusAfterLoad = false;
  if (state.loadingFuture && state.setFocusAfterLoad) {
    setFocusAfterLoad = true;
    if (newItems.length) {
      firstNewDayKey = formatDayKey(newItems[0].dateBucketMoment);
    }
  }
  return {firstNewDayKey, setFocusAfterLoad};
}

function gotItemsSuccess (state, action) {
  const focusState = determineFocusAfterLoad(state, action);
  const linkState = getNextUrls(state, action);
  const newState = {...focusState, ...linkState};
  return loadingState(state, newState);
}

function addPendingPastItems (state, action) {
  if (anyNewActivity(action.payload.internalItems)) {
    return gotItemsSuccess(state, action);
  } else {
    return {...state, ...getNextUrls(state, action)};
  }
}

export default handleActions({
  GOT_ITEMS_SUCCESS: gotItemsSuccess,
  ADD_PENDING_PAST_ITEMS: addPendingPastItems,
  START_LOADING_OPPORTUNITIES: (state, action) => {
    return {...state, loadingOpportunities: true};
  },
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
  },
  ADD_OPPORTUNITIES: (state, action) => {
    return {...state, loadingOpportunities: false};
  },
}, loadingState({}, {
  allPastItemsLoaded: false,
  allFutureItemsLoaded: false,
  setFocusAfterLoad: false,
  firstNewDayKey: null,
  futureNextUrl: null,
  pastNextUrl: null,
}));
