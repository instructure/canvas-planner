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
import { handleActions } from 'redux-actions';
import _ from 'lodash';

export default handleActions({
  ADD_OPPORTUNITIES: (state, action) => {
    return action.payload;
  },
  DISMISSED_OPPORTUNITY: (state, action) => {
    let stateCopy = _.cloneDeep(state);
    let dismissedOpportunity = stateCopy.find((opportunity) => opportunity.id === action.payload.plannable_id + "");
    if (dismissedOpportunity.planner_override) {
      dismissedOpportunity.planner_override.dismissed = action.payload.dismissed;
    } else {
      dismissedOpportunity.planner_override = action.payload;
    }
    return stateCopy;
  }
}, []);
