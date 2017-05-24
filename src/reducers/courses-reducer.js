import { handleActions } from 'redux-actions';

export default handleActions({
  INITIAL_OPTIONS: (state, action) => action.payload.courses,
}, []);
