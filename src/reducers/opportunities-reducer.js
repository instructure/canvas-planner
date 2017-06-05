import { handleActions } from 'redux-actions';

export default handleActions({
  ADD_OPPORTUNITIES: (state, action) => {
    return action.payload;
  },
}, []);
