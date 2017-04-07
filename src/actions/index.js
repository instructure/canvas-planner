import { createActions } from 'redux-actions';
import axios from 'axios';

export const { testAction }  = createActions({
  TEST_ACTION: (value) => value
});

export const testAsyncAction = () => {
  return (dispatch) => {
    axios.get(`/api/v1/items/1`)
         .then(response => {
           dispatch(testAction(response.data.value));
         });
  };
}
