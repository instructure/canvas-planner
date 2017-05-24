/**
* This file generates the data used by our json-server.
*/

const moment = require('moment-timezone');

const {
  createFakeAssignment,
  createFakeDiscussion,
  createFakeQuiz,
  generateStatus,
  generateActivity
} = require('./utils');



module.exports = () => {
  const data = {
    planner: {},
    items: [
      createFakeAssignment(
        "Java War",
        "1",
        moment().subtract(2, 'days').endOf('day'),
        false,
        generateStatus(['missing']),
        generateActivity(false, ['new_feedback'])
      ),
      createFakeQuiz(
        "History Prequiz",
        "1",
        moment().subtract(1, 'days').startOf('day').add(17, 'hours'),
        false,
        generateStatus(['graded']),
        generateActivity(false, ['new_grades'])
      ),
      createFakeAssignment(
        "English Civil Wars",
        "1",
        moment().endOf('day'),
        true,
        generateStatus(),
        generateActivity()
      ),
      createFakeAssignment(
        "War of Jenkins Ear",
        "1",
        moment().endOf('day'),
        false,
        generateStatus(['submitted']),
        generateActivity()
      ),
      createFakeAssignment(
        "Great Turkish War",
        "1",
        moment().endOf('day').add(1, 'days'),
        true,
        generateStatus(),
        generateActivity()
      ),
      createFakeAssignment(
        "Seven Years War",
        "1",
        moment().endOf('day').add(1, 'days'),
        true,
        generateStatus(),
        generateActivity()
      ),
      createFakeAssignment(
        "American Revolution",
        "1",
        moment().endOf('day').add(1, 'days'),
        true,
        generateStatus(),
        generateActivity()
      ),
      createFakeDiscussion(
        "Which revolution is your favorite?",
        "1",
        moment().endOf('day').add(2, 'days'),
        false,
        generateStatus(),
        generateActivity(true, ['new_replies'])
      ),

      createFakeQuiz("Shakespeare", "2", moment().startOf('day').add(1, 'days').add(8, 'hours')),
      createFakeAssignment("English Poetry and Prose", "2", moment().endOf('day')),
      createFakeAssignment("English Drama", "2", moment().endOf('day')),
      createFakeAssignment("English Fiction", "2", moment().endOf('day')),
      createFakeDiscussion("English Short Stories", "2", moment().endOf('day').add(1, 'days')),
    ]
  };



  return data;
};
