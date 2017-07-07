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
import pendingReducer from '../pending-items-reducer';

it('appends past items', () => {
  const initialState = {past: [{existing: 'item'}], future: []};
  const newState = pendingReducer(initialState, {type: 'ADD_PENDING_PAST_ITEMS', payload: {
    internalItems: [{first: 'item'}, {second: 'item'}],
  }});
  expect(newState).toEqual({
    future: [],
    past: [
      {existing: 'item'},
      {first: 'item'},
      {second: 'item'},
    ],
  });
});

it('flushes past items', () => {
  const initialState = {past: [{existing: 'item'}], future: [{future: 'item'}]};
  const newState = pendingReducer(initialState, {type: 'FLUSH_PENDING_PAST_ITEMS'});
  expect(newState).toEqual({
    future: [{future: 'item'}],
    past: [],
  });
});
