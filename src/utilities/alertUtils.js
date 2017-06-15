let visualSuccessFunc = null;
let visualErrorFunc = null;
let srAlertFunc = null;

export function initialize ({ visualSuccessCallback, visualErrorCallback, srAlertCallback }) {
  visualSuccessFunc = visualSuccessCallback;
  visualErrorFunc = visualErrorCallback;
  srAlertFunc = srAlertCallback;
}

export function alert (message, isError = false) {
  if (isError) {
    visualErrorFunc(message);
  } else {
    visualSuccessFunc(message);
  }
}

export function srAlert (message) {
  srAlertFunc(message);
}
