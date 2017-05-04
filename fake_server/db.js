/**
* This file generates the data used by our json-server.
*/

const moment = require('moment');

const getKindaUniqueId = () => Math.floor(Math.random() * (100000 - 1) + 1);

const contexts = {
  course_1: {
    type: "Course",
    id: "1",
    title: "World History I",
    image_url: "https://c1.staticflickr.com/6/5473/14502036741_b3d9f4f345_n.jpg",
    color: "#BE0EAA"
  },
  course_2: {
    type: "Course",
    id: "2",
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
        completed: Math.random() >= 0.5,
        points: Math.floor(Math.random()* 100),
        context: contexts.course_1
      },
      {
        id: getKindaUniqueId(),
        date: moment().subtract(1, 'days').format('YYYY-MM-DD'),
        type: "Quiz",
        title: "Shakespeare",
        completed: Math.random() >= 0.5,
        points: Math.floor(Math.random()* 100),
        context: contexts.course_2
      },

      // Add some completed items
      {
        id: getKindaUniqueId(),
        date: moment().format('YYYY-MM-DD'),
        type: "Assignment",
        title: "World War I Essay",
        completed: true,
        points: Math.floor(Math.random()* 100),
        context: contexts.course_1
      },
      {
        id: getKindaUniqueId(),
        date: moment().format('YYYY-MM-DD'),
        type: "Announcement",
        title: "Submit your book list today!",
        completed: true,
        points: Math.floor(Math.random()* 100),
        context: contexts.course_1
      },

      // Add some Notes
      {
        id: getKindaUniqueId(),
        date: moment().format('YYYY-MM-DD'),
        type: null,
        title: "GET MY STUFF TODAY",
        completed: true,
        context: contexts.course_1
      },
      {
        id: getKindaUniqueId(),
        date: moment().format('YYYY-MM-DD'),
        type: null,
        title: "Submit your book list today!",
        completed: true,
      },

      // Make sure there are always some current day items
      {
        id: getKindaUniqueId(),
        date: moment().format('YYYY-MM-DD'),
        type: "Assignment",
        title: "History essay",
        completed: false,
        points: Math.floor(Math.random()* 100),
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
