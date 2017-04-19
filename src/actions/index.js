import { createActions } from 'redux-actions';
import axios from 'axios';

export const { testAction, gotItemsSuccess }  = createActions({
  TEST_ACTION: (value) => value,

}, 'GOT_ITEMS_SUCCESS');

export const testAsyncAction = () => {
  return (dispatch) => {
    axios.get(`/api/v1/items/1`)
         .then(response => {
           dispatch(testAction(response.data.value));
         });
  };
}

export const getPlannerItems = () => {
  return (dispatch) => {
    axios.get(`/api/v1/planner/items`)
         .then(response => {
           dispatch(gotItemsSuccess(response.data));
         });
  }
}
