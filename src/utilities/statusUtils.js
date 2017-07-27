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
import formatMessage from '../format-message';
import _ from 'lodash';

const PILL_MAPPING = {
  'missing': { id: 'missing', text: formatMessage('Missing'), variant: 'danger' },
  'late': { id: 'late', text: formatMessage('Late'), variant: 'danger' },
  'graded': { id: 'graded', text: formatMessage('Graded') },
  'excused': { id: 'excused', text: formatMessage('Excused') },
  'submitted': { id: 'submitted', text: formatMessage('Submitted') },
  'new_grades': { id: 'new_grades', text: formatMessage('New Grades') },
  'has_feedback': { id: 'new_feedback', text: formatMessage('New Feedback') },
  'new_replies': { id: 'new_replies', text: formatMessage('New Replies') },
};

export function anyNewActivity (items) {
  return items && items.some((item => item.newActivity));
}

/**
* Returns an array of pill objects that the particular item
* qualifies to have
*/
export function getBadgesForItem (item) {
  let badges = [];
  if (item.status) {
    badges = Object.keys(item.status)
      .filter(key => item.status[key] && PILL_MAPPING.hasOwnProperty(key))
      .map(a => PILL_MAPPING[a]);

    if (item.status.unread_count) {
      badges.push(PILL_MAPPING.new_replies);
    }
  }

  return badges;
}

/**
* Returns an array of pill objects that the items qualify to have
*/
export function getBadgesForItems (items) {
  const badges = [];
  if (items.some(i => i.status && i.status.graded)) {
    badges.push(PILL_MAPPING.new_grades);
  }
  if (items.some(i => i.status && i.status.has_feedback)) {
    badges.push(PILL_MAPPING.has_feedback);
  }
  if (items.some(i => i.status && i.status.unread_count)) {
    badges.push(PILL_MAPPING.new_replies);
  }
  return badges;
}
