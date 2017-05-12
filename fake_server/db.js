/**
* This file generates the data used by our json-server.
*/

const moment = require('moment');

const {
  createFakeAssignment,
  createFakeDiscussion,
  createFakeQuiz
} = require('./utils');


module.exports = () => {
  const data = {
    planner: {},
    items: [
      createFakeQuiz("History Prequiz", "1", moment().subtract(1, 'days').startOf('day').add(17, 'hours').format()),
      createFakeAssignment("English Civil Wars", "1", moment().endOf('day').format()),
      createFakeAssignment("War of Jenkins Ear", "1", moment().endOf('day').format()),
      createFakeAssignment("Great Turkish War", "1", moment().endOf('day').add(1, 'days').format()),
      createFakeAssignment("Seven Years War", "1", moment().endOf('day').add(1, 'days').format(), true),
      createFakeAssignment("American Revolution", "1", moment().endOf('day').add(1, 'days').format(), true),
      createFakeDiscussion("Which revolution is your favorite?", "1", moment().endOf('day').add(2, 'days').format()),

      createFakeQuiz("Shakespeare", "2", moment().startOf('day').add(1, 'days').add(8, 'hours').format()),
      createFakeAssignment("English Poetry and Prose", "2", moment().endOf('day').format()),
      createFakeAssignment("English Drama", "2", moment().endOf('day').format()),
      createFakeAssignment("English Fiction", "2", moment().endOf('day').format()),
      createFakeDiscussion("English Short Stories", "2", moment().endOf('day').add(1, 'days').format()),
    ]
  };



  return data;
};
