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
import { getBadgesForItem, getBadgesForItems, anyNewActivity } from '../statusUtils';

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
      id: 'new_replies', text: 'Replies',
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

  it('returns New Grades object when at least one new activity item has a graded status', () => {
    const items = [{ newActivity: true, status: { graded: true } }, { status: { excused: true } }];
    expect(getBadgesForItems(items)).toContainEqual({
      id: 'new_grades',
      text: 'Graded'
    });
  });

  it('returns New Feedback object when at least one new activity item has a has_feedback status', () => {
    const items = [{ status: { fake: true } }, { newActivity: true, status: { has_feedback: true } }];
    expect(getBadgesForItems(items)).toContainEqual({
      id: 'new_feedback',
      text: 'Feedback'
    });
  });

  it('returns Missing object when at least one new activity item has a missing status', () => {
    const items = [{ status: { fake: true } }, { newActivity: true, status: { missing: true } }];
    expect(getBadgesForItems(items)).toContainEqual({
      id: 'missing',
      text: 'Missing',
      variant: 'danger'
    });
  });

  it('does not return New Grades object when only old items have a graded status', () => {
    const items = [{ status: { graded: true } }, { status: { excused: true } }];
    expect(getBadgesForItems(items)).toEqual([]);
  });

  it('does not return New Feedback object when only old items have a has_feedback status', () => {
    const items = [{ status: { fake: true } }, { status: { has_feedback: true } }];
    expect(getBadgesForItems(items)).toEqual([]);
  });

  it('returns New Replies object when at least one item has a non-zero unread count', () => {
    const items = [{ status: { unread_count: 0 } }, { status: { unread_count: 3 } }];
    expect(getBadgesForItems(items)).toContainEqual({
      id: 'new_replies',
      text: 'Replies'
    });
  });
});

describe('new activity', () => {
  it('detects items for new activity', () => {
    const items = [ {newActivity: false}, {newActivity: true} ];
    expect(anyNewActivity(items)).toBeTruthy();
  });

  it('does not detect items when no new activity', () => {
    const items = [ {newActivity: false}, {newActivity: false} ];
    expect(anyNewActivity(items)).toBeFalsy();
  });
});
