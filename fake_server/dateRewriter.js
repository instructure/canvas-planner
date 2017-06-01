const moment = require('moment-timezone');

module.exports = (req, res, next) => {
  if (req.query.due_after) {
    const due_at_gte = moment(req.query.due_after).tz('UTC');
    req.query['plannable.due_at_gte'] = due_at_gte.format();
    delete req.query.due_after;
    if (!req.query.due_before) {
      const due_at_lte = due_at_gte.clone().add(1, 'days');
      req.query['plannable.due_at_lte'] = due_at_lte.format();
    }
  }

  if (req.query.due_before) {
    const due_at_lte = moment(req.query.due_before).tz('UTC');
    req.query['plannable.due_at_lte'] = due_at_lte.format();
    delete req.query.due_before;
    if (!req.query.due_after) {
      const due_at_gte = due_at_lte.clone().add(-1, 'days');
      req.query['plannable.due_at_gte'] = due_at_gte.format();
    }
  }

  if (req.query.filter && req.query.filter === 'new_activity') {
    req.query['activity_like'] = 'new_.*';
    delete req.query.filter;
  }
  next();
};
