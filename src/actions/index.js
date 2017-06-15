import { createAction, createActions } from 'redux-actions';
import axios from 'axios';
import moment from 'moment';
import {formatDayKey} from '../utilities/dateUtils';
import { transformApiToInternalItem, transformInternalToApiItem } from '../utilities/apiUtils';

export const {
  initialOptions,
  addOpportunities,
  startLoadingOpportunities,
  startDismissingOpportunity,
  savingPlannerItem,
  savedPlannerItem,
  dismissedOpportunity,
  deletingPlannerItem,
  deletedPlannerItem,
} = createActions(
  'INITIAL_OPTIONS',
  'ADD_OPPORTUNITIES',
  'DISMISSED_OPPORTUNITY',
  'START_LOADING_OPPORTUNITIES',
  'START_DISMISSING_OPPORTUNITY',
  'SAVING_PLANNER_ITEM',
  'SAVED_PLANNER_ITEM',
  'DELETING_PLANNER_ITEM',
  'DELETED_PLANNER_ITEM',
);

export * from './loading-actions';

let dayCount = 1;
export const addDay = createAction('ADD_DAY', () => {
  return formatDayKey(moment().add(dayCount++, 'days'));
});

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

export const getOpportunities = () => {
  return (dispatch, getState) => {
    dispatch(startLoadingOpportunities());
    axios({
      method: 'get',
      url: '/api/v1/users/self/missing_submissions?include[]=planner_overrides',
    }).then(response => {
      dispatch(addOpportunities(response.data));
    });
  };
};

export const dismissOpportunity = (id, plannerOverride) => {
  return (dispatch, getState) => {
    dispatch(startDismissingOpportunity(id));
    if (plannerOverride) {
      axios({
        method: 'put',
        params: {
          id: plannerOverride.id,
          visible: false,
        },
        url: `/api/v1/planner/overrides/${plannerOverride.id}`,
      }).then(response => {
        dispatch(dismissedOpportunity(response.data));
      });
    } else {
      axios({
        method: 'post',
        params: {
          plannable_id: id,
          plannable_type: 'Assignment',
          visible: false,
        },
        url: '/api/v1/planner/overrides',
      }).then(response => {
        dispatch(dismissedOpportunity(response.data));
      });
    }
  };
};

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
