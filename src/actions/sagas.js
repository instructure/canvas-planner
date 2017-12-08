/*
 * Copyright (C) 2017 - present Instructure, Inc.
 *
 * This module is part of Canvas.
 *
 * This module and Canvas are free software: you can redistribute them and/or modify them under
 * the terms of the GNU Affero General Public License as published by the Free
 * Software Foundation, version 3 of the License.
 *
 * This module and Canvas are distributed in the hope that they will be useful, but WITHOUT ANY
 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
 * A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
 * details.
 *
 * You should have received a copy of the GNU Affero General Public License along
 * with this program. If not, see <http://www.gnu.org/licenses/>.
 */

import moment from 'moment-timezone';
import { put, select, call, all, takeEvery } from 'redux-saga/effects';
import { addPendingPastItems, flushPendingPastItems, gotItemsError, gotItemsSuccess, sendFetchRequest } from './loading-actions';

export default function* allSagas () {
  yield all([
    call(watchForSagas),
  ]);
}

function* watchForSagas () {
  yield takeEvery('START_LOADING_PAST_UNTIL_NEW_ACTIVITY', loadPastUntilNewActivitySaga);
}

export function* loadPastUntilNewActivitySaga () {
  let currentState = yield select();
  const getState = () => currentState;
  try {
    while (currentState.loading.seekingNewActivity) {
      const fromMoment = moment.tz(currentState.timeZone).startOf('day');
      const loadingOptions = {fromMoment, getState, intoThePast: true};
      const {transformedItems, response} = yield call(sendFetchRequest, loadingOptions);
      yield put(addPendingPastItems(transformedItems, response));
      currentState = yield select();
    }
    yield put(gotItemsSuccess(currentState.pendingItems.past));
  } catch (e) {
    yield put(gotItemsError(e));
    throw e;
  } finally {
    yield put(flushPendingPastItems());
  }
}
