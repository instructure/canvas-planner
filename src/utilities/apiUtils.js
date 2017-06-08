import moment from 'moment-timezone';

const getItemDetailsFromPlannable = (apiResponse) => {
  const { plannable, html_url} = apiResponse;
  return {
    title: plannable.name || plannable.title,
    date: plannable.due_at || plannable.todo_date,
    completed: plannable.has_submitted_submissions, // TODO: Fix this to use the status field
    points: plannable.points_possible,
    html_url,
  };
};

const getItemType = (apiResponse) => {
  const TYPE_MAPPING = {
    quiz: "Quiz",
    discussion_topic: "Discussion",
    assignment: "Assignment",
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

  return {
    ...contextInfo,
    id: apiResponse.id,
    dateBucketMoment: moment.tz(details.date, timeZone).startOf('day'),
    type: getItemType(apiResponse),
    status: apiResponse.status,
    activity: apiResponse.activity,
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
    assignment: {
      id: internalItem.id,
      due_at: internalItem.date,
      name: internalItem.title,
      description: internalItem.details,
    }
  };
}
