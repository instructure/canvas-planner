const moment = require('moment-timezone');

module.exports = (req, res, next) => {
  if (req.query.due_after) {
    req.query['assignment.due_at_gte'] = moment(req.query.due_after).tz('UTC').format();
    delete req.query.due_after;
  }
  if (req.query.due_before) {
    req.query['assignment.due_at_lte'] = moment(req.query.due_before).tz('UTC').format();
    delete req.query.due_before;
  }
  next();
};
