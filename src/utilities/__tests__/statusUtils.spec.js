import { getBadgesForItem, getBadgesForItems } from '../statusUtils';

describe('getBadgesForItem', () => {
  it('returns an empty array when there is not activity or status', () => {
    expect(getBadgesForItem({})).toHaveLength(0);
  });

  it('returns missing status with a danger variant and "Missing" text', () => {
    const item = { status: ['missing'] };
    expect(getBadgesForItem(item)).toEqual([{
      text: 'Missing',
      variant: 'danger'
    }]);
  });

  it('returns late status with a danger variant and "Late" text', () => {
    const item = { status: ['late'] };
    expect(getBadgesForItem(item)).toEqual([{
      text: 'Late',
      variant: 'danger'
    }]);
  });

  it('returns activity when given an activity to translate', () => {
    const item = { activity: ['new_replies'] };
    expect(getBadgesForItem(item)).toEqual([{
      text: 'New Replies'
    }]);
  });

  it('returns a list of both activity and status with activity first and then status', () => {
    const item = { status: ['excused'], activity: ['new_replies'] };
    expect(getBadgesForItem(item)).toEqual([
      { text: 'New Replies' },
      { text: 'Excused' }
    ]);
  });
});

describe('getBadgesForItems', () => {
  it('returns an empty array if nothing matches', () => {
    expect(getBadgesForItems([{ status: 'excused' }, { status: 'late' }])).toEqual([]);
  });

  it('returns New Grades object when at least one item has a graded status', () => {
    const items = [{ status: ['graded'] }, { status: ['excused'] }];
    expect(getBadgesForItems(items)).toContainEqual({
      text: 'New Grades'
    });
  });

  it('returns New Feedback object when at least one item has a new_feedback activity', () => {
    const items = [{ activity: ['fake'] }, { activity: ['new_feedback'] }];
    expect(getBadgesForItems(items)).toContainEqual({
      text: 'New Feedback'
    });
  });

  it('returns New Replies object when at least one item has a new_replies activity', () => {
    const items = [{ activity: ['fake'] }, { activity: ['new_replies'] }];
    expect(getBadgesForItems(items)).toContainEqual({
      text: 'New Replies'
    });
  });
});
