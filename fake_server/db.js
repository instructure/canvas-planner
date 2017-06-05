/**
* This file generates the data used by our json-server.
*/

const moment = require('moment-timezone');

const {
  createFakeAssignment,
  createFakeDiscussion,
  createFakeQuiz,
  generateStatus
} = require('./utils');



module.exports = () => {
  const data = {
    planner: {},
    items: [
      // 2 days ago
      createFakeAssignment(
        "Java War",
        "1",
        moment().subtract(2, 'days').endOf('day'),
        false,
        generateStatus({ missing: true, has_feedback: true })
      ),
      createFakeAssignment(
        "C++ War",
        "1",
        moment().subtract(2, 'days').endOf('day'),
        false,
        generateStatus(['missing']),
        generateActivity(false, ['new_feedback'])
      ),
      createFakeQuiz(
        "War of the Language",
        "2",
        moment().subtract(2, 'days').endOf('day'),
        false,
        generateStatus(['missing']),
        generateActivity(false, ['new_feedback'])
      ),

      // yestreday
      createFakeQuiz(
        "History Prequiz",
        "1",
        moment().subtract(1, 'days').startOf('day').add(17, 'hours'),
        false,
        generateStatus({ graded: true })
      ),
      createFakeAssignment(
        "The Role of Pokémon in Ancient Rome",
        "1",
        moment().subtract(1, 'days').startOf('day').add(17, 'hours'),
        false,
        generateStatus(['graded']),
        generateActivity(false, ['new_grades'])
      ),
      createFakeAssignment(
        "The Great Migration",
        "1",
        moment().subtract(1, 'days').startOf('day').add(17, 'hours'),
        false,
        generateStatus(['graded']),
        generateActivity(false, ['new_grades'])
      ),

      // today
      createFakeAssignment(
        "English Civil Wars",
        "1",
        moment().endOf('day'),
        true,
        generateStatus()
      ),
      createFakeAssignment(
        "War of Jenkins Ear",
        "1",
        moment().endOf('day'),
        false,
        generateStatus({ submitted: true, needs_grading: true })
      ),
      createFakeAssignment("English Poetry and Prose", "2", moment().endOf('day')),
      createFakeAssignment("English Drama", "2", moment().endOf('day')),
      createFakeAssignment("English Fiction", "2", moment().endOf('day')),

      // tomorrow
      createFakeAssignment(
        "Great Turkish War",
        "1",
        moment().endOf('day').add(1, 'days'),
        true,
        generateStatus()
      ),
      createFakeAssignment(
        "Seven Years War",
        "1",
        moment().endOf('day').add(1, 'days'),
        true,
        generateStatus()
      ),
      createFakeAssignment(
        "American Revolution",
        "1",
        moment().endOf('day').add(1, 'days'),
        true,
        generateStatus({ graded: true })
      ),
      createFakeQuiz("Shakespeare", "2", moment().startOf('day').add(1, 'days').add(8, 'hours')),
      createFakeDiscussion("English Short Stories", "2", moment().endOf('day').add(1, 'days')),

      // the day after tomorrow
      createFakeDiscussion(
        "Which revolution is your favorite?",
        "1",
        moment().endOf('day').add(2, 'days'),
        false,
        generateStatus()
      ),

    ]
  };



  return data;
};
