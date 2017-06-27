import _ from 'lodash';
import moment from 'moment-timezone';
import { handleActions } from 'redux-actions';
import { formatDayKey } from '../utilities/dateUtils';

function addDay (state, action) {
  const newState = state.concat([[action.payload, []]]);
  return _.sortBy(newState, _.head);
}

function savedPlannerItem (state, action) {
  if (action.error) return state;
  const plannerItem = action.payload;
  const plannerDateString = formatDayKey(plannerItem.dateBucketMoment);
  const plannerDay = state.find(day => day[0] === plannerDateString);
  if (!plannerDay) return state;
  return gotItemsSuccess(state, [plannerItem]);
}

function deletedPlannerItem (state, action) {
  if (action.error) return state;
  const doomedPlannerItem = action.payload;
  const plannerDateString = formatDayKey(doomedPlannerItem.dateBucketMoment);
  const keyedState = new Map(state);
  const existingDay = keyedState.get(plannerDateString);
  if (existingDay == null) return state;

  const newDay = existingDay.filter(item => item.id !== doomedPlannerItem.id);
  keyedState.set(plannerDateString, newDay);
  return [...keyedState.entries()];
}

function mergeDays(firstDay, secondDay) {
  const secondDayMap = new Map(secondDay.map(item => [item.id, item]));
  const firstDayMerged = firstDay.map(firstDayItem => {
    const secondDayItem = secondDayMap.get(firstDayItem.id);
    if (secondDayItem) {
      secondDayMap.delete(secondDayItem.id);
      return secondDayItem;
    } else {
      return firstDayItem;
    }
  });
  return firstDayMerged.concat([...secondDayMap.values()]);
}

function addMissingDays (dayKeyToItems) {
  const sortedDayKeys = Object.keys(dayKeyToItems).sort();
  if (sortedDayKeys.length === 0) return;
  // timezones don't matter for this algorithm
  const dateIterator = moment(sortedDayKeys[0]);
  const lastDate = moment(sortedDayKeys[sortedDayKeys.length - 1]);
  while (dateIterator.isBefore(lastDate)) {
    const dayKey = formatDayKey(dateIterator);
    if (!dayKeyToItems.hasOwnProperty(dayKey)) {
      dayKeyToItems[dayKey] = [];
    }
    dateIterator.add(1, 'days');
  }
}

function gotItemsSuccess (state, items) {
  const newGroups = _.groupBy(items, (item) => {
    return formatDayKey(item.dateBucketMoment);
  });
  const mergedGroups = _.fromPairs(state);
  _.mergeWith(mergedGroups, newGroups, (firstDay, secondDay) => {
    if (firstDay == null) firstDay = [];
    return mergeDays(firstDay, secondDay);
  });
  addMissingDays(mergedGroups);
  return _.chain(mergedGroups)
    .toPairs()
    .sortBy(_.head)
    .value();
}

export default handleActions({
  GOT_ITEMS_SUCCESS: (state, action) => gotItemsSuccess(state, action.payload.internalItems),
  ADD_DAY: addDay,
  SAVED_PLANNER_ITEM: savedPlannerItem,
  DELETED_PLANNER_ITEM: deletedPlannerItem,
}, []);
