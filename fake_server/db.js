/**
* This file generates the data used by our json-server.
*/

const moment = require('moment');

const getKindaUniqueId = () => Math.floor(Math.random() * (100000 - 1) + 1);

const contexts = {
  course_1: {
    type: "Course",
    id: getKindaUniqueId(),
    title: "World History I",
    image_url: "https://c1.staticflickr.com/6/5473/14502036741_b3d9f4f345_n.jpg",
    color: "#B930A0"
  },
  course_2: {
    type: "Course",
    id: getKindaUniqueId(),
    title: "English Literature",
    image_url: "https://c1.staticflickr.com/7/6238/6363562459_7399ee3c3e_n.jpg",
    color: "#19C3B4"
  }
};

module.exports = () => {
  const data = {
    planner: {},
    items: [
      // Add some past items
      {
        id: getKindaUniqueId(),
        date: moment().subtract(1, 'days').format('YYYY-MM-DD'),
        type: "Assignment",
        title: "World War II Essay",
        completed: true,
        context: contexts.course_1
      },
      {
        id: getKindaUniqueId(),
        date: moment().subtract(1, 'days').format('YYYY-MM-DD'),
        type: "Quiz",
        title: "Shakespeare",
        completed: true,
        context: contexts.course_2
      },

      // Add some completed items
      {
        id: getKindaUniqueId(),
        date: moment().format('YYYY-MM-DD'),
        type: "Assignment",
        title: "World War I Essay",
        completed: true,
        context: contexts.course_1
      },
      {
        id: getKindaUniqueId(),
        date: moment().format('YYYY-MM-DD'),
        type: "Announcement",
        title: "Submit your book list today!",
        completed: true,
        context: contexts.course_2
      },

      // Make sure there are always some current day items
      {
        id: getKindaUniqueId(),
        date: moment().format('YYYY-MM-DD'),
        type: "Assignment",
        title: "History essay",
        completed: false,
        context: contexts.course_1
      },
      {
        id: getKindaUniqueId(),
        date: moment().format('YYYY-MM-DD'),
        type: "Announcement",
        title: "You must pick your literary hero today!",
        completed: false,
        context: contexts.course_2
      },
      // Put in some items that are for the next two days
      {
        id: getKindaUniqueId(),
        date: moment().add(1, 'days').format('YYYY-MM-DD'),
        type: "Quiz",
        title: "Middle East Quiz",
        completed: false,
        context: contexts.course_1
      },
      {
        id: getKindaUniqueId(),
        date: moment().add(2, 'days').format('YYYY-MM-DD'),
        type: "Assignment",
        title: "Pencil or Pen Essay",
        completed: false,
        context: contexts.course_2
      },
    ]
  };



  return data;
};
