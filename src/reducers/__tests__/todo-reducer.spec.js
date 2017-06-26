import todoReducer from '../todo-reducer';

function basicTodo (options = {}) {
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
    badges: [],
    ...options
  };
}

it('adds todo notes to the state on UPDATE_TODO', () => {
  const initialState = {};

  const newState = todoReducer(initialState, {
    type: 'UPDATE_TODO',
    payload: basicTodo()
  });

  expect(newState.id).toBe('6');
});

it('clears the todo note item on CLEAR_UPDATE_TODO', () => {
  const initialState = basicTodo();
  const newState = todoReducer(initialState, {
    type: 'CLEAR_UPDATE_TODO'
  });
  expect(newState).toEqual({});
});

