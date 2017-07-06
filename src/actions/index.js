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
import { createAction, createActions } from 'redux-actions';
import axios from 'axios';
import moment from 'moment';
import configureAxios from '../utilities/configureAxios';
import {formatDayKey} from '../utilities/dateUtils';
import { alert } from '../utilities/alertUtils';
import formatMessage from '../format-message';
import {
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
    const apiOverride = Object.assign({}, plannerOverride);
    apiOverride.dismissed = true;
    let promise = apiOverride.id ?
      saveExistingPlannerOverride(apiOverride) :
      saveNewPlannerOverride(apiOverride);
    promise = promise.then(response => dispatch(dismissedOpportunity(response.data)));
    return promise;
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
    }).then(response => transformPlannerNoteApiToInternalItem(response.data, getState().courses, getState().timeZone))
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
