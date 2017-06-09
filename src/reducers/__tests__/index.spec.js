import moment from 'moment-timezone';
import rootReducer from '../index';

it('sets the default state for all properties empty initial state', () => {
  const newState = rootReducer({}, { type: 'FAKE_ACTION' });
  expect(newState).toMatchObject({
    courses: [],
    locale: 'en',
    timeZone: 'UTC',
    items: [],
    days: [],
    loading: {
      isLoading: false
    },
    firstNewActivityDate: null,
  });
});

it('clones the first new activity date moment', () => {
  const initialState = rootReducer({}, { type: 'blah' });
  const mockMoment = moment();
  const nextState = rootReducer(initialState, {
    type: 'FOUND_FIRST_NEW_ACTIVITY_DATE',
    payload: mockMoment,
  });
  expect(nextState.firstNewActivityDate).not.toBe(mockMoment);
});
