const moment = require('moment-timezone');

module.exports = (req, res, next) => {
  if (req.query.due_after) {
    req.query['plannable.due_at_gte'] = moment(req.query.due_after).tz('UTC').format();
    delete req.query.due_after;
  }
  if (req.query.due_before) {
    req.query['plannable.due_at_lte'] = moment(req.query.due_before).tz('UTC').format();
    delete req.query.due_before;
  }

  if (req.query.filter && req.query.filter === 'new_activity') {
    req.query['activity_like'] = 'new_.*';
    delete req.query.filter;
  }
  next();
};
