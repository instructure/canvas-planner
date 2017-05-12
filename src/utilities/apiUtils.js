
const getItemFromResponse = (apiResponse) => {
  if (apiResponse.assignment) { return apiResponse.assignment; }
  return {};
};

const getItemType = (apiResponse) => {
  // TODO: Add remaining types here
  if (apiResponse.assignment.is_quiz_assignment) { return "Quiz"; }
  if (apiResponse.assignment.discussion_topic) { return "Discussion"; }
  return "Assignment";
};


/**
* Translates the API data to the format the planner expects
**/
export function translateAPIData (apiResponse, courses) {
  const item = getItemFromResponse(apiResponse);
  const contextId = apiResponse[`${apiResponse.context_type.toLowerCase()}_id`];
  const course = courses.find(c => c.id === contextId);

  return {
    context: {
      type: apiResponse.context_type,
      id: contextId,
      title: course.shortName,
      image_url: course.image,
      color: course.color
    },
    id: item.id,
    date: item.due_at,
    type: getItemType(apiResponse),
    title: item.name,
    completed: item.has_submitted_submissions,
    points: item.points_possible
  };
}
