import { createAction, createActions } from 'redux-actions';
import axios from 'axios';
import moment from 'moment';
import {formatDayKey} from '../utilities/dateUtils';

export const {
  initializeCourses,
  gotItemsSuccess,
  startLoadingItems,
  savingPlannerItem,
  savedPlannerItem,
  deletingPlannerItem,
  deletedPlannerItem,
}  = createActions(
  'INITIALIZE_COURSES',
  'GOT_ITEMS_SUCCESS',
  'START_LOADING_ITEMS',
  'SAVING_PLANNER_ITEM',
  'SAVED_PLANNER_ITEM',
  'DELETING_PLANNER_ITEM',
  'DELETED_PLANNER_ITEM',
);

let dayCount = 1;
export const addDay = createAction('ADD_DAY', () => {
  return formatDayKey(moment().add(dayCount++, 'days'));
});

export const getPlannerItems = () => {
  return (dispatch) => {
    dispatch(startLoadingItems());
    axios.get(`/api/v1/planner/items`)
         .then(response => {
           dispatch(gotItemsSuccess(response.data));
         });
  };
};

function saveExistingPlannerItem (plannerItem) {
  return axios({
    method: 'put',
    url: `api/v1/planner/items/${plannerItem.id}`,
    data: plannerItem,
  });
}

function saveNewPlannerItem (plannerItem) {
  return axios({
    method: 'post',
    url: 'api/v1/planner/items',
    data: plannerItem,
  });
}

export const savePlannerItem = (plannerItem) => {
  return (dispatch) => {
    dispatch(savingPlannerItem(plannerItem));
    const promise = plannerItem.id ?
      saveExistingPlannerItem(plannerItem) :
      saveNewPlannerItem(plannerItem);
    dispatch(savedPlannerItem(promise));
    return promise;
  };
};

export const deletePlannerItem = (plannerItem) => {
  return (dispatch) => {
    dispatch(deletingPlannerItem(plannerItem));
    dispatch(deletedPlannerItem(axios({
      method: 'delete',
      url: `api/v1/planner/items/${plannerItem.id}`,
    })));
  };
};
