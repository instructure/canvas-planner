import { handleActions } from 'redux-actions';

export default handleActions({
  UPDATE_TODO: (state, action) => {
    return action.payload;
  },
  CLEAR_UPDATE_TODO: (state, action) => {
    return {};
  }
}, {});
