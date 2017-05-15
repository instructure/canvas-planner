import _ from 'lodash';

function handleScrollUpAttempt (cb, e) {
  e.preventDefault();
  cb();
}

function handleWindowWheel (cb, wind, e) {
  if (wind.pageYOffset === 0 && e.deltaY < 0) {
    handleScrollUpAttempt(cb, e);
  }
}

function handleWindowScrollKey (cb, wind, e) {
  if (wind.pageYOffset === 0 &&
      (e.key === 'PageUp' || e.key === 'ArrowUp' || e.key === 'Up')) {
    handleScrollUpAttempt(cb, e);
  }
}

export function registerScrollEvents (scrollIntoPastCb, wind = window) {
  // do debounce here so tests aren't dependant on global state
  const boundWindowWheel = _.debounce(
    handleWindowWheel.bind(undefined, scrollIntoPastCb, wind),
  500, {leading: true, trailing: false});
  wind.addEventListener('wheel', boundWindowWheel);

  const boundScrollKey = handleWindowScrollKey.bind(undefined, scrollIntoPastCb, wind);
  wind.addEventListener('keydown', boundScrollKey);
}
