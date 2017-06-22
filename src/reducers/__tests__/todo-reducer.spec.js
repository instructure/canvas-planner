import opportunitiesReducer from '../todo-reducer';

function basicTodo (option) {
  return {
    theme:{
      iconColor: "#629f56"
    },
    color: "#629f56",
    id: "6",
    courseName: "Chat",
    context:{
      type: "Planner Note",
      id: "1",
      title: "Chat",
      image_url: null,
      color: "#629f56",
      url: "/courses/1"
    },
    date: "2017-06-22T14:32:22.000Z",
    associated_item: "To Do",
    title: "asdfasdfsdf",
    badges: []
  };
}

it('adds items to the state on ADD_OPPORTUNITIES', () => {
  const initialState = [];

  const newState = opportunitiesReducer(initialState, {
    type: 'UPDATE_TODO',
    payload: basicTodo()
  });

  expect(newState.id).toBe('6');
});

