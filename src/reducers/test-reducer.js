import { handleActions } from 'redux-actions';

export default handleActions({
  TEST_ACTION: (state, action) => ({
    testValue: state.testValue + action.payload
  })
}, { testValue: 0});
