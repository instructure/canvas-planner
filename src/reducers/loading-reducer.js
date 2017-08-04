/*
 * Copyright (C) 2017 - present Instructure, Inc.
 *
 * This module is part of Canvas.
 *
 * This module and Canvas are free software: you can redistribute them and/or modify them under
 * the terms of the GNU Affero General Public License as published by the Free
 * Software Foundation, version 3 of the License.
 *
 * This module and Canvas are distributed in the hope that they will be useful, but WITHOUT ANY
 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
 * A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
 * details.
 *
 * You should have received a copy of the GNU Affero General Public License along
 * with this program. If not, see <http://www.gnu.org/licenses/>.
 */
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
    return loadingState(state, {loadingPast: true, seekingNewActivity: action.payload.seekingNewActivity});
  },
  GETTING_FUTURE_ITEMS: (state, action) => {
    return loadingState(state, {loadingFuture: true, setFocusAfterLoad: action.payload.setFocusAfterLoad});
  },
  ALL_FUTURE_ITEMS_LOADED: (state, action) => {
    return loadingState(state, {allFutureItemsLoaded: true, setFocusAfterLoad: false});
  },
  ALL_OPPORTUNITIES_LOADED: (state, action) => {
    return loadingState(state, {loadingOpportunities: false, allOpportunitiesLoaded: true});
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
  allOpportunitiesLoaded: false,
  loadingOpportunities: false,
  setFocusAfterLoad: false,
  firstNewDayKey: null,
  futureNextUrl: null,
  pastNextUrl: null,
  seekingNewActivity: false,
}));
