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
import { getBadgesForItem, getBadgesForItems, isNewActivityItem, anyNewActivity } from '../statusUtils';

describe('getBadgesForItem', () => {
  it('returns an empty array when there is not activity or status', () => {
    expect(getBadgesForItem({})).toHaveLength(0);
  });

  it('returns missing status with a danger variant and "Missing" text', () => {
    const item = { status: { missing: true } };
    expect(getBadgesForItem(item)).toEqual([{
      id: 'missing',
      text: 'Missing',
      variant: 'danger'
    }]);
  });

  it('returns late status with a danger variant and "Late" text', () => {
    const item = { status: { late: true } };
    expect(getBadgesForItem(item)).toEqual([{
      id: 'late',
      text: 'Late',
      variant: 'danger'
    }]);
  });

  it('returns new_replies status when there is an unread_count', () => {
    const item = { status: { unread_count: 42 }};
    expect(getBadgesForItem(item)).toEqual([{
      id: 'new_replies', text: 'New Replies',
    }]);
  });

  it('does not set new_replies when unread_count is 0', () => {
    const item = { status: { unread_count: 0 }};
    expect(getBadgesForItem(item)).toEqual([]);
  });

  it('does not barf on unrecognized statuses', () => {
    const item = { status: { barf: true }};
    expect(getBadgesForItem(item)).toEqual([]);
  });
});

describe('getBadgesForItems', () => {
  it('returns an empty array if nothing matches', () => {
    expect(getBadgesForItems([{ status: 'excused' }, { status: 'late' }])).toEqual([]);
  });

  it('returns New Grades object when at least one item has a graded status', () => {
    const items = [{ status: { graded: true } }, { status: { excused: true } }];
    expect(getBadgesForItems(items)).toContainEqual({
      id: 'new_grades',
      text: 'New Grades'
    });
  });

  it('returns New Feedback object when at least one item has a has_feedback status', () => {
    const items = [{ status: { fake: true } }, { status: { has_feedback: true } }];
    expect(getBadgesForItems(items)).toContainEqual({
      id: 'new_feedback',
      text: 'New Feedback'
    });
  });

  it('returns New Replies object when at least one item has a non-zero unread count', () => {
    const items = [{ status: { unread_count: 0 } }, { status: { unread_count: 3 } }];
    expect(getBadgesForItems(items)).toContainEqual({
      id: 'new_replies',
      text: 'New Replies'
    });
  });
});

describe('new activity', () => {
  it('can determine if an item has any new activity status', () => {
    const item = { status: { has_feedback: true }};
    expect(isNewActivityItem(item)).toBeTruthy();
  });

  it('excludes items with a status that is not new activity', () => {
    const item = { status: { late: true }};
    expect(isNewActivityItem(item)).toBeFalsy();
  });

  it('detects items for new activity', () => {
    const items = [ {status: {}}, {status: {new_grades: true}} ];
    expect(anyNewActivity(items)).toBeTruthy();
  });

  it('does not detect items when no new activity', () => {
    const items = [ {status: {late: true}}, {status: {graded: true}} ];
    expect(anyNewActivity(items)).toBeFalsy();
  });
});
