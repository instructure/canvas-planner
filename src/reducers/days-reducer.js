import { groupBy, merge, cloneDeep } from 'lodash';
import { handleActions } from 'redux-actions';
import { formatDayKey } from '../utilities/dateUtils';

function addDay (state, action) {
  const dateKey = formatDayKey(action.payload);
  return {...state, [dateKey]: []};
}

function addNewPlannerItemToDate(state, plannerItem, plannerDateString) {
  return {...state,
    [plannerDateString]: state[plannerDateString].concat(plannerItem)};
}

function savedPlannerItem (state, action) {
  if (action.error) return state;

  const plannerItem = action.payload.data;
  const plannerDateString = formatDayKey(plannerItem.date);
  const plannerDay = state[plannerDateString];
  // that date isn't loaded, so do nothing
  if (!plannerDay) return state;

  const newDay = cloneDeep(plannerDay);
  const existingItem = newDay.find((item) => item.id === plannerItem.id);
  if (!existingItem) {
    return addNewPlannerItemToDate(state, plannerItem, plannerDateString);
  } else {
    merge(existingItem, plannerItem); // existingItem is a clone, so this is ok
    return {...state, [plannerDateString]: newDay};
  }
}

function deletedPlannerItem (state, action) {
  if (action.error) return state;

  const plannerItem = action.payload.data;
  const plannerDateString = formatDayKey(plannerItem.date);
  const dayInState = state[plannerDateString];
  if (!dayInState) return state;
  const newDay = dayInState.filter((item) => item.id !== plannerItem.id);
  return {...state, [plannerDateString]: newDay};
}

export default handleActions({
  GOT_ITEMS_SUCCESS: (state, action) => {
    const dayGrouping = groupBy(action.payload, 'date');
    return merge(state, dayGrouping);
  },
  ADD_DAY: addDay,
  SAVED_PLANNER_ITEM: savedPlannerItem,
  DELETED_PLANNER_ITEM: deletedPlannerItem,
}, {});
