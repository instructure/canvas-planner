import testReducer from '../test-reducer';

describe('TEST_ACTION', () => {
  it('adds payload to state', () => {
    const initialState = { testValue: 30};
    const action = { type: 'TEST_ACTION', payload: 70 };
    const actualState = testReducer(initialState, action);
    const expectedState = { testValue: 100 };
    expect(actualState).toEqual(expectedState);
  })
});
