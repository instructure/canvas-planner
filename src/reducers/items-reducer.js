import { handleActions } from 'redux-actions';

export default handleActions({
  GOT_ITEMS_SUCCESS: (state, action) => state.concat(action.payload)
}, []);
