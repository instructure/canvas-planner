import opportunitiesReducer from '../opportunities-reducer';

function basicOpportunity (option) {
  return {
    id: "6",
    course_id: "1",
    name: "always something",
    planner_override:{
      id:"1",
      plannable_type:"Assignment",
      plannable_id:"6",
      user_id:"3",
      workflow_state:"active",
      marked_complete: false,
      deleted_at:null,
      created_at:"2017-06-15T02:33:28Z",
      updated_at:"2017-06-15T20:47:24Z"
    }
  };
}

it('adds items to the state on ADD_OPPORTUNITIES', () => {
  const initialState = [];

  const newState = opportunitiesReducer(initialState, {
    type: 'ADD_OPPORTUNITIES',
    payload: [{ date: '2017-04-28' }, { date: '2017-04-29' }]
  });

  expect(newState.length).toBe(2);
});

it('updates state correctly on DISMISSED_OPPORTUNITY with opportunity that has overide', () => {
  const initialState = [basicOpportunity()];

  const newState = opportunitiesReducer(initialState, {
    type: 'DISMISSED_OPPORTUNITY',
    payload: {id: "6", marked_complete: true, plannable_id: "6"}
  });

  expect(newState[0].planner_override.marked_complete).toBe(true);
});

it('adds to opportunity object if no planner override DISMISSED_OPPORTUNITY', () => {
  let initialState = [basicOpportunity()];

  initialState[0].planner_override = null;

  const newState = opportunitiesReducer(initialState, {
    type: 'DISMISSED_OPPORTUNITY',
    payload: {id: "6", marked_complete: true, plannable_id: "6"}
  });

  expect(newState[0].planner_override.marked_complete).toBe(true);
});
