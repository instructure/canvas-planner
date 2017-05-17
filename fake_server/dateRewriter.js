module.exports = (req, res, next) => {
  if (req.query.date) {
    let direction = 'gte';
    if (req.query['a_link_to_the_past']) direction = 'lte';
    req.query[`assignment.due_at_${direction}`] = req.query.date;
    delete req.query.date;
  }
  next();
};
