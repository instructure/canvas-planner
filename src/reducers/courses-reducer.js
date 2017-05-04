import { handleActions } from 'redux-actions';

export default handleActions({
  INITIALIZE_COURSES: (state, action) => action.payload,
}, []);
