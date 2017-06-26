import { createAction, createActions } from 'redux-actions';
import axios from 'axios';
import moment from 'moment';
import configureAxios from '../utilities/configureAxios';
import {formatDayKey} from '../utilities/dateUtils';
import { alert } from '../utilities/alertUtils';
import formatMessage from '../format-message';
import {
  transformApiToInternalItem,
  transformInternalToApiItem,
  transformInternalToApiOverride,
  transformPlannerNoteApiToInternalItem
} from '../utilities/apiUtils';


configureAxios(axios);

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
  updateTodo,
  clearUpdateTodo,
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
  'UPDATE_TODO',
  'CLEAR_UPDATE_TODO'
);

export * from './loading-actions';

let dayCount = 1;
export const addDay = createAction('ADD_DAY', () => {
  return formatDayKey(moment().add(dayCount++, 'days'));
});

function saveExistingPlannerItem (apiItem) {
  return axios({
    method: 'put',
    url: `api/v1/planner_notes/${apiItem.id}`,
    data: apiItem,
  });
}

function saveNewPlannerItem (apiItem) {
  return axios({
    method: 'post',
    url: 'api/v1/planner_notes',
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
    }).catch(() => alert(formatMessage('Failed to load opportunities'), true));
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
          marked_complete: true,
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
          plannable_type: 'assignment',
          marked_complete: true,
        },
        url: '/api/v1/planner/overrides',
      }).then(response => {
        dispatch(dismissedOpportunity(response.data));
      });
    }
  };
};

export const savePlannerItem = (plannerItem) => {
  plannerItem.date = moment(plannerItem.date).endOf('day').format('YYYY-MM-DDTHH:mm:ssZ');

  return (dispatch, getState) => {
    dispatch(savingPlannerItem(plannerItem));
    const apiItem = transformInternalToApiItem(plannerItem);
    let promise = plannerItem.id ?
      saveExistingPlannerItem(apiItem) :
      saveNewPlannerItem(apiItem);
    promise = promise.then(response => transformPlannerNoteApiToInternalItem(response.data, getState().courses, getState().timeZone))
                     .catch(() => alert(formatMessage('Failed to save to do'), true));
    dispatch(savedPlannerItem(promise));
    return promise;
  };
};

export const deletePlannerItem = (plannerItem) => {
  return (dispatch, getState) => {
    dispatch(deletingPlannerItem(plannerItem));
    const promise = axios({
      method: 'delete',
      url: `api/v1/planner_notes/${plannerItem.id}`,
    }).then(response => transformApiToInternalItem(response.data, getState().courses, getState().timeZone))
      .catch(() => alert(formatMessage('Failed to delete to do'), true));
    dispatch(deletedPlannerItem(promise));
    return promise;
  };
};

function saveExistingPlannerOverride (apiOverride) {
  return axios({
    method: 'put',
    url: `api/v1/planner/overrides/${apiOverride.id}`,
    data: apiOverride,
  });
}

function saveNewPlannerOverride (apiOverride) {
  return axios({
    method: 'post',
    url: 'api/v1/planner/overrides',
    data: apiOverride,
  });
}

export const togglePlannerItemCompletion = (plannerItem) => {
  return (dispatch, getState) => {
    dispatch(savingPlannerItem(plannerItem));
    const apiOverride = transformInternalToApiOverride(plannerItem, getState().userId);
    apiOverride.marked_complete = !apiOverride.marked_complete;
    let promise = apiOverride.id ?
      saveExistingPlannerOverride(apiOverride) :
      saveNewPlannerOverride(apiOverride);
    promise = promise.then(response => updateOverrideDataOnItem(plannerItem, response.data));
    dispatch(savedPlannerItem(promise));
    return promise;
  };
};

function updateOverrideDataOnItem (plannerItem, apiOverride) {
  let updatedItem = {...plannerItem};
  updatedItem.overrideId = apiOverride.id;
  updatedItem.completed = apiOverride.marked_complete;
  updatedItem.show = true;
  return updatedItem;
}
