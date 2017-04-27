import { handleActions } from 'redux-actions';

export default handleActions({
  START_LOADING_ITEMS: (state, action) => {
    return { isLoading: true };
  },
  GOT_ITEMS_SUCCESS: (state, action) => {
    return { isLoading: false };
  }
}, { isLoading: false });
