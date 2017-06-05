import { createAction, createActions } from 'redux-actions';
import axios from 'axios';
import moment from 'moment';
import {formatDayKey} from '../utilities/dateUtils';
import { transformApiToInternalItem, transformInternalToApiItem } from '../utilities/apiUtils';
import { getFirstLoadedMoment, getLastLoadedMoment } from '../utilities/dateUtils';
import parseLinkHeader from 'parse-link-header';

export const {
  initialOptions,
  gotItemsSuccess,
  startLoadingItems,
  savingPlannerItem,
  savedPlannerItem,
  deletingPlannerItem,
  deletedPlannerItem,
  gettingPastItems,
  gettingFutureItems,
  allFutureItemsLoaded,
  allPastItemsLoaded,
}  = createActions(
  'INITIAL_OPTIONS',
  'GOT_ITEMS_SUCCESS',
  'START_LOADING_ITEMS',
  'SAVING_PLANNER_ITEM',
  'SAVED_PLANNER_ITEM',
  'DELETING_PLANNER_ITEM',
  'DELETED_PLANNER_ITEM',
  'GETTING_PAST_ITEMS',
  'GETTING_FUTURE_ITEMS',
  'ALL_FUTURE_ITEMS_LOADED',
  'ALL_PAST_ITEMS_LOADED',
);

let dayCount = 1;
export const addDay = createAction('ADD_DAY', () => {
  return formatDayKey(moment().add(dayCount++, 'days'));
});

function handleLoadPlannerItemsResponse (response, onNothing, dispatch, getState) {
  const parsedLinkHeader = parseLinkHeader(response.headers.link);
  if (response.data.length === 0 && (!parsedLinkHeader || !parsedLinkHeader.next)) {
    onNothing(dispatch, getState);
    return [];
  } else {
    const translatedData = response.data.map((item) =>
      transformApiToInternalItem(item, getState().courses, getState().timeZone));
    dispatch(gotItemsSuccess({
      internalItems: translatedData,
      response: response,
    }));
    return translatedData;
  }
}

function loadPlannerItems (fromMoment, onNothing, dispatch, getState, intoThePast = false) {
  let timeParam = 'due_after';
  let linkField = 'futureNextUrl';
  if (intoThePast) {
    timeParam = 'due_before';
    linkField = 'pastNextUrl';
  }

  const nextPageUrl = getState().loading[linkField];
  let getPromise = null;
  if (nextPageUrl) {
    getPromise = axios.get(nextPageUrl);
  } else {
    getPromise = axios.get(`/api/v1/planner/items`, {
      params: {
        [timeParam]: fromMoment.format(),
      }
    });
  }

  return getPromise.then(
    response => handleLoadPlannerItemsResponse(response, onNothing, dispatch, getState)
  );
}

function everythingLoaded(dispatch, getState) {
  everythingFuture(dispatch, getState);
  everythingPast(dispatch, getState);
}

function everythingFuture(dispatch) {
  dispatch(allFutureItemsLoaded());
}

function everythingPast(dispatch) {
  dispatch(allPastItemsLoaded());
}

export const getPlannerItems = (fromMoment) => {
  return (dispatch, getState) => {
    dispatch(startLoadingItems());
    return loadPlannerItems(fromMoment, everythingLoaded, dispatch, getState);
  };
};

function saveExistingPlannerItem (apiItem) {
  return axios({
    method: 'put',
    url: `api/v1/planner/items/${apiItem.id}`,
    data: apiItem,
  });
}

function saveNewPlannerItem (apiItem) {
  return axios({
    method: 'post',
    url: 'api/v1/planner/items',
    data: apiItem,
  });
}

export const savePlannerItem = (plannerItem) => {
  return (dispatch, getState) => {
    dispatch(savingPlannerItem(plannerItem));
    const apiItem = transformInternalToApiItem(plannerItem);
    let promise = plannerItem.id ?
      saveExistingPlannerItem(apiItem) :
      saveNewPlannerItem(apiItem);
    promise = promise.then(response => transformApiToInternalItem(response.data, getState().courses, getState().timeZone));
    dispatch(savedPlannerItem(promise));
    return promise;
  };
};

export const deletePlannerItem = (plannerItem) => {
  return (dispatch, getState) => {
    dispatch(deletingPlannerItem(plannerItem));
    const promise = axios({
      method: 'delete',
      url: `api/v1/planner/items/${plannerItem.id}`,
    }).then(response => transformApiToInternalItem(response.data, getState().courses, getState().timeZone));
    dispatch(deletedPlannerItem(promise));
    return promise;
  };
};

export const loadFutureItems = (options = {setFocusAfterLoad: false}) => {
  return (dispatch, getState) => {
    dispatch(gettingFutureItems(options));
    const fromMoment = getLastLoadedMoment(getState()).add(1, 'days');
    return loadPlannerItems(fromMoment, everythingFuture, dispatch, getState);
  };
};

export const scrollIntoPast = () => {
  return (dispatch, getState) => {
    const beforeMoment = getFirstLoadedMoment(getState());
    dispatch(gettingPastItems());
    return loadPlannerItems(beforeMoment, everythingPast, dispatch, getState, true);
  };
};
