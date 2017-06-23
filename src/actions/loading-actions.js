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
import { createActions, createAction } from 'redux-actions';
import axios from 'axios';
import parseLinkHeader from 'parse-link-header';
import { getFirstLoadedMoment, getLastLoadedMoment } from '../utilities/dateUtils';
import { transformApiToInternalItem } from '../utilities/apiUtils';
import { anyNewActivity } from '../utilities/statusUtils';
import { alert, srAlert } from '../utilities/alertUtils';
import formatMessage from '../format-message';

export const {
  startLoadingItems,
  foundFirstNewActivityDate,
  gettingFutureItems,
  allFutureItemsLoaded,
  allPastItemsLoaded,
  flushPendingPastItems,
} = createActions(
  'START_LOADING_ITEMS',
  'FOUND_FIRST_NEW_ACTIVITY_DATE',
  'GETTING_FUTURE_ITEMS',
  'ALL_FUTURE_ITEMS_LOADED',
  'ALL_PAST_ITEMS_LOADED',
  'FLUSH_PENDING_PAST_ITEMS',
);

export const gettingPastItems = createAction('GETTING_PAST_ITEMS', (opts = {seekingNewActivity: false}) => {
  return opts;
});

export const gotItemsSuccess = createAction('GOT_ITEMS_SUCCESS', (newItems, response) => {
  return {
    internalItems: newItems,
    response: response,
  };
});

export const addPendingPastItems = createAction('ADD_PENDING_PAST_ITEMS', (newItems, response) => {
  return {
    internalItems: newItems,
    response: response,
  };
});

export function getFirstNewActivityDate (fromMoment) {
  // We are requesting ascending order and only grabbing the first item,
  // specifically so we know what the very oldest new activity is
  return (dispatch, getState) => {
    fromMoment = fromMoment.clone().subtract(6, 'months');
    return axios.get('api/v1/planner/items', { params: {
      start_date: fromMoment.format(),
      filter: 'new_activity',
      order: 'asc'
    }}).then(response => {
      if (response.data.length) {
        const first = transformApiToInternalItem(response.data[0], getState().courses, getState().timeZone);
        dispatch(foundFirstNewActivityDate(first.dateBucketMoment));
      }
    }).catch(() => alert(formatMessage('Failed to get new activity'), true));
  };
}

export function getPlannerItems (fromMoment) {
  return (dispatch, getState) => {
    dispatch(startLoadingItems());
    dispatch(getFirstNewActivityDate(fromMoment));
    const loadingOptions = {
      dispatch, getState,
      fromMoment,
      intoThePast: false,
      onGotItems: handleGotItems,
      onNothing: () => {
        dispatch(allFutureItemsLoaded());
        dispatch(allPastItemsLoaded());
      }
    };
    return sendFetchRequest(loadingOptions);
  };
}

export function loadFutureItems (options = {}) {
  return (dispatch, getState) => {
    dispatch(gettingFutureItems(options));
    const loadingOptions = {
      dispatch, getState,
      intoThePast: false,
      fromMoment: getLastLoadedMoment(getState().days, getState.timeZone).add(1, 'days'),
      onGotItems: handleGotItems,
      onNothing: () => dispatch(allFutureItemsLoaded()),
      ...options,
    };
    return sendFetchRequest(loadingOptions);
  };
}

export function scrollIntoPast () {
  return (dispatch, getState) => {
    dispatch(gettingPastItems());
    const loadingOptions = {
      dispatch, getState,
      intoThePast: true,
      fromMoment: getFirstLoadedMoment(getState().days, getState().timeZone),
      onGotItems: handleGotItems,
      onNothing: () => dispatch(allPastItemsLoaded()),
    };
    return sendFetchRequest(loadingOptions);
  };
}

export const loadPastUntilNewActivity = () => (dispatch, getState) => {
  dispatch(gettingPastItems({seekingNewActivity: true}));
  const loadingOptions = {
    dispatch, getState,
    intoThePast: true,
    fromMoment: getFirstLoadedMoment(getState().days, getState().timeZone),
    onNothing: handleLoadPastItemsUntilNewActivity,
    onGotItems: handleLoadPastItemsUntilNewActivity,
  };
  return sendFetchRequest(loadingOptions);
};

function handleGotItems (loadingOptions, response, newItems) {
  srAlert(
    formatMessage(`Loaded { count, plural,
      =0 {# items}
      one {# item}
      other {# items}
    }`, { count: newItems.length})
  );
  loadingOptions.dispatch(gotItemsSuccess(newItems, response));
}

function handleLoadPastItemsUntilNewActivity (loadingOptions, response, newItems) {
  const dispatch = loadingOptions.dispatch;
  const parsedLinkHeader = parseLinkHeader(response.headers.link);
  const noMoreItems = !newItems;
  const hasNext = !!(parsedLinkHeader && parsedLinkHeader.next);

  if (newItems) dispatch(addPendingPastItems(newItems, response));
  if (noMoreItems || !hasNext || anyNewActivity(newItems)) {
    const allPastItems = loadingOptions.getState().pendingItems.past;
    dispatch(gotItemsSuccess(allPastItems, response));
    dispatch(flushPendingPastItems());
  } else {
    dispatch(loadPastUntilNewActivity());
  }
}

function sendFetchRequest (loadingOptions) {
  return axios.get(...fetchParams(loadingOptions))
    .then(response => handleFetchResponse(loadingOptions, response))
    .catch(() => alert(formatMessage('Error loading items'), true));
}

function fetchParams (loadingOptions) {
  let timeParam = 'start_date';
  let linkField = 'futureNextUrl';
  if (loadingOptions.intoThePast) {
    timeParam = 'end_date';
    linkField = 'pastNextUrl';
  }
  const nextPageUrl = loadingOptions.getState().loading[linkField];
  if (nextPageUrl) {
    return [nextPageUrl, {}];
  } else {
    const params = {
      [timeParam]: loadingOptions.fromMoment.format()
    };
    if (loadingOptions.intoThePast) {
      params.order = 'desc';
    }
    return [
      '/api/v1/planner/items',
      { params },
    ];
  }
}

function handleFetchResponse (loadingOptions, response) {
  if (nothingWasLoaded(loadingOptions, response)) {
    loadingOptions.onNothing(loadingOptions, response);
    return [];
  } else {
    const transformedItems = transformItems(loadingOptions, response.data);
    loadingOptions.onGotItems(loadingOptions, response, transformedItems);
    return transformedItems;
  }
}

function nothingWasLoaded (loadingOptions, response) {
  const parsedLinkHeader = parseLinkHeader(response.headers.link);
  return response.data.length === 0 && (!parsedLinkHeader || !parsedLinkHeader.next);
}

function transformItems (loadingOptions, items) {
  return items.map(item => transformApiToInternalItem(
    item,
    loadingOptions.getState().courses,
    loadingOptions.getState().timeZone,
  ));
}
