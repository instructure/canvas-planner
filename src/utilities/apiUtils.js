import moment from 'moment-timezone';

const getItemDetailsFromPlannable = (apiResponse) => {
  const { plannable, plannable_type } = apiResponse;
  const details = {
    course_id: plannable.course_id,
    title: plannable.name || plannable.title,
    date: plannable.due_at || plannable.todo_date,
    completed: plannable.has_submitted_submissions, // TODO: Fix this to use the status field
    points: plannable.points_possible,
    html_url: plannable.html_url,
  };
  if (plannable_type === 'discussion_topic') {
    if (apiResponse.plannable.assignment) {
      details.date = apiResponse.plannable.assignment.due_at;
    }
    details.unread_count = plannable.unread_count;
  }
  if (plannable_type === 'announcement' && !details.date) {
    details.date = plannable.posted_at;
  }

  return details;
};

const getItemType = (apiResponse) => {
  const TYPE_MAPPING = {
    quiz: "Quiz",
    discussion_topic: "Discussion",
    assignment: "Assignment",
    wiki_page: "Page",
    announcement: "Announcement",
    planner_note: "To Do"
  };

  return TYPE_MAPPING[apiResponse.plannable_type];
};


/**
* Translates the API data to the format the planner expects
**/
export function transformApiToInternalItem (apiResponse, courses, timeZone) {
  if (timeZone == null) throw new Error('timezone is required when interpreting api data in transformApiToInternalItem');

  const contextInfo = {};
  if (apiResponse.context_type) {
    const contextId = apiResponse[`${apiResponse.context_type.toLowerCase()}_id`];
    const course = courses.find(c => c.id === contextId);
    contextInfo.context = {
      type: apiResponse.context_type,
      id: contextId,
      title: course.shortName,
      image_url: course.image,
      color: course.color,
      url: course.href
    };
  }

  const details = getItemDetailsFromPlannable(apiResponse);

  if ((!contextInfo.context) && apiResponse.plannable_type === 'planner_note' && (details.course_id)) {
    const course = courses.find(c => c.id === details.course_id);
    contextInfo.context = {
      type: 'Planner Note',
      id: details.course_id,
      title: course.shortName,
      image_url: course.image,
      color: course.color,
      url: course.href
    };
  }

  if (details.unread_count && apiResponse.submissions) {
    apiResponse.submissions.unread_count = details.unread_count;
  }
  return {
    ...contextInfo,
    id: apiResponse.plannable_id,
    dateBucketMoment: moment.tz(details.date, timeZone).startOf('day'),
    type: getItemType(apiResponse),
    status: apiResponse.submissions,
    ...details
  };
}

/**
* Turn internal item format into data the API can consume for save actions
*/
export function transformInternalToApiItem (internalItem) {
  const contextInfo = {};
  if (internalItem.context) {
    contextInfo.context_type = internalItem.context.type || 'Course';
    contextInfo[`${contextInfo.context_type.toLowerCase()}_id`] = internalItem.context.id;
  }
  return {
    id: internalItem.id,
    ...contextInfo,
    todo_date: internalItem.date,
    title: internalItem.title,
    details: internalItem.details,
  };
}
