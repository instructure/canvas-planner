import { handleActions } from 'redux-actions';
import _ from 'lodash';

export default handleActions({
  ADD_OPPORTUNITIES: (state, action) => {
    return action.payload;
  },
  DISMISSED_OPPORTUNITY: (state, action) => {
    let stateCopy = _.cloneDeep(state);
    let dismissedOpportunity = stateCopy.find((opportunity) => opportunity.id === action.payload.planner_override.plannable_id + "");
    if (dismissedOpportunity.planner_override) {
      dismissedOpportunity.planner_override.marked_complete = action.payload.planner_override.marked_complete;
    } else {
      dismissedOpportunity.planner_override = action.payload.planner_override;
    }
    return stateCopy;
  }
}, []);
