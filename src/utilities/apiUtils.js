import moment from 'moment-timezone';

const getItemFromResponse = (apiResponse) => {
  if (apiResponse.assignment) { return apiResponse.assignment; }
  return {};
};

const getItemType = (apiResponse) => {
  // TODO: Add remaining types here
  if (apiResponse.assignment.is_quiz_assignment) return "Quiz";
  else if (apiResponse.assignment.discussion_topic) return "Discussion";
  else if (apiResponse.assignment.grading_type) return "Assignment";
  else return null;
};


/**
* Translates the API data to the format the planner expects
**/
export function transformApiToInternalItem (apiResponse, courses, timeZone) {
  if (timeZone == null) throw new Error('timezone is required when interpreting api data in transformApiToInternalItem');
  const item = getItemFromResponse(apiResponse);
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

  return {
    ...contextInfo,
    id: apiResponse.id,
    date: item.due_at,
    dateBucketMoment: moment.tz(item.due_at, timeZone).startOf('day'),
    type: getItemType(apiResponse),
    title: item.name,
    html_url: item.html_url,
    completed: item.has_submitted_submissions,
    points: item.points_possible
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
    assignment: {
      id: internalItem.id,
      due_at: internalItem.date,
      name: internalItem.title,
      description: internalItem.details,
    }
  };
}
