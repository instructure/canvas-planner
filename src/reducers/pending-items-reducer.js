import { handleActions } from 'redux-actions';

export default handleActions({
  ADD_PENDING_PAST_ITEMS: (state, action) => ({...state, past: [...state.past, ...action.payload.internalItems]}),
  FLUSH_PENDING_PAST_ITEMS: (state, action) => ({...state, past: []}),
}, {
  past: [],
  future: [],
});
