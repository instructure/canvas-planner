const moment = require('moment-timezone');

module.exports = (req, res, next) => {
  // For VMs, uncomment this line and modify as needed to get correct link header for paging
  // req.headers.host = '10.0.2.2:3004';

  if (req.query.due_after) {
    const due_at_gte = moment(req.query.due_after).tz('UTC');
    req.query['plannable.due_at_gte'] = due_at_gte.format();
    delete req.query.due_after;
    // If you only want to return one day at a time, uncomment this clause
    // putting this in will break new activity because it queries for new activity in the deep past
    // if (!req.query.due_before) {
    //   const due_at_lte = due_at_gte.clone().add(1, 'days');
    //   req.query['plannable.due_at_lte'] = due_at_lte.format();
    // }
  }

  if (req.query.due_before) {
    const due_at_lte = moment(req.query.due_before).tz('UTC');
    req.query['plannable.due_at_lte'] = due_at_lte.format();
    delete req.query.due_before;
    // If you only want to return one day at a time, uncomment this clause
    // keeping this in for now because _sort doesn't work on nested data, like 'plannable.due_at'
    if (!req.query.due_after) {
      const due_at_gte = due_at_lte.clone().add(-1, 'days');
      req.query['plannable.due_at_gte'] = due_at_gte.format();
    }
  }

  // this should probably be in separate pagination middleware. meh.
  let prefix = '&';
  if (Object.keys(req.query).length === 0) prefix = '?';

  if (!req.query._page) {
    req.query._page = '1';
    // have to muck with originalUrl because that's how the Link header is generated
    req.originalUrl = `${req.originalUrl}${prefix}_page=${req.query._page}`;
    prefix = '&';
  }

  if (!req.query._limit) {
    req.query._limit = '2';
    // ditto
    req.originalUrl = `${req.originalUrl}${prefix}_limit=${req.query._limit}`;
    prefix = '&';
  }

  if (req.query.filter && req.query.filter === 'new_activity') {
    req.query['status.has_feedback'] = 'true';
    delete req.query.filter;
  }

  next();
};
