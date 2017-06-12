import { getBadgesForItem, getBadgesForItems } from '../statusUtils';

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
