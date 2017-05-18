import formatMessage from '../format-message';
const PILL_MAPPING = {
  'missing': { id: 'missing', text: formatMessage('Missing'), variant: 'danger' },
  'late': { id: 'late', text: formatMessage('Late'), variant: 'danger' },
  'graded': { id: 'graded', text: formatMessage('Graded') },
  'excused': { id: 'excused', text: formatMessage('Excused') },
  'submitted': { id: 'submitted', text: formatMessage('Submitted') },
  'new_grades': { id: 'new_grades', text: formatMessage('New Grades') },
  'new_feedback': { id: 'new_feedback', text: formatMessage('New Feedback') },
  'new_replies': { id: 'new_replies', text: formatMessage('New Replies') },
};

/**
* Returns an array of pill objects that the particular item
* qualifies to have
*/
export function getBadgesForItem (item) {
  let badges = [];
  if (item.activity) {
    badges = badges.concat(item.activity.map(a => PILL_MAPPING[a]));
  }
  if (item.status) {
    badges = badges.concat(item.status.map(a => PILL_MAPPING[a]));
  }
  return badges;
}

/**
* Returns an array of pill objects that the items qualify to have
*/
export function getBadgesForItems (items) {
  const badges = [];
  if (items.some(i => i.status && i.status.includes('graded'))) {
    badges.push(PILL_MAPPING.new_grades);
  }
  if (items.some(i => i.activity && i.activity.includes('new_feedback'))) {
    badges.push(PILL_MAPPING.new_feedback);
  }
  if (items.some(i => i.activity && i.activity.includes('new_replies'))) {
    badges.push(PILL_MAPPING.new_replies);
  }
  return badges;
}
