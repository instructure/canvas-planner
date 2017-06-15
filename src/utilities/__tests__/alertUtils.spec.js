import * as AlertUtils from '../alertUtils';

describe('alert', () => {
  const fakeVisualSuccess = jest.fn();
  const fakeVisualError = jest.fn();

  beforeAll(() => {
    AlertUtils.initialize({
      visualSuccessCallback: fakeVisualSuccess,
      visualErrorCallback: fakeVisualError
    });
  });

  it('calls the visualSuccessCallback when isError is false (by default)', () => {
    AlertUtils.alert('Hey');
    expect(fakeVisualSuccess).toHaveBeenCalledWith('Hey');
  });

  it('call the visualErrorCallback when isError is true', () => {
    AlertUtils.alert('Hey You', true);
    expect(fakeVisualError).toHaveBeenCalledWith('Hey You');
  });
});

describe('srAlert', () => {
  it('calls srAlertCallback', () => {
    const fakeSRAlert = jest.fn();
    AlertUtils.initialize({
      srAlertCallback: fakeSRAlert
    });
    AlertUtils.srAlert('This is something else :)');
    expect(fakeSRAlert).toHaveBeenCalledWith('This is something else :)');
  });
});
