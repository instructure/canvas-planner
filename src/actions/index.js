import { createActions } from 'redux-actions';
import axios from 'axios';

export const {
  testAction,
  gotItemsSuccess,
  startLoadingItems,
  addDay
}  = createActions(
  'TEST_ACTION',
  'GOT_ITEMS_SUCCESS',
  'START_LOADING_ITEMS',
  'ADD_DAY'
);

export const testAsyncAction = () => {
  return (dispatch) => {
    axios.get(`/api/v1/items/1`)
         .then(response => {
           dispatch(testAction(response.data.value));
         });
  };
};

export const getPlannerItems = () => {
  return (dispatch) => {
    dispatch(startLoadingItems());
    axios.get(`/api/v1/planner/items`)
         .then(response => {
           dispatch(gotItemsSuccess(response.data));
         });
  };
};
