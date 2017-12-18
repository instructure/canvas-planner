/*
 * Copyright (C) 2017 - present Instructure, Inc.
 *
 * This file is part of Canvas.
 *
 * Canvas is free software: you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License as published by the Free
 * Software Foundation, version 3 of the License.
 *
 * Canvas is distributed in the hope that they will be useful, but WITHOUT ANY
 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
 * A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
 * details.
 *
 * You should have received a copy of the GNU Affero General Public License along
 * with this program. If not, see <http://www.gnu.org/licenses/>.
 */
import _ from 'lodash';
import moment from 'moment-timezone';
import { handleActions } from 'redux-actions';
import { formatDayKey } from '../utilities/dateUtils';
import { findPlannerItemById } from '../utilities/storeUtils';

function savedPlannerItem (state, action) {
  if (action.error) return state;
  const plannerItem = action.payload.item;
  if(plannerItem.id) {
    // editing existing, remove the old copy
    state = _deletePlannerItem(state, plannerItem.id);
  }
  const plannerDateString = formatDayKey(plannerItem.dateBucketMoment);
  const plannerDay = state.find(day => day[0] === plannerDateString);
  if (!plannerDay) {
    const newState = state.concat([[plannerDateString, []]]);
    return gotItemsSuccess(newState, [plannerItem]);
  }
  return gotItemsSuccess(state, [plannerItem]);
}

function deletedPlannerItem (state, action) {
  if (action.error) return state;
  return _deletePlannerItem(state, action.payload);
}

function _deletePlannerItem(state, payload) {
  let doomedPlannerItem;
  if('string' === typeof payload) {
    // payload is the item id. find it
    doomedPlannerItem = findPlannerItemById(state, payload);
  } else {
    doomedPlannerItem = payload;
  }
  if (!doomedPlannerItem) {
    return state;
  }
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
  SAVED_PLANNER_ITEM: savedPlannerItem,
  DELETED_PLANNER_ITEM: deletedPlannerItem,
}, []);
