import _ from 'lodash';
import Velocity from 'velocity-animate';

const animationQueue = [];

function runAnimationQueue () {
  while (animationQueue.length) {
    const animationFn = animationQueue.shift();
    animationFn();
  }
}

// Based on this formula:
// element's position in the viewport + the window's scroll position === the element's position in the document
// so if we want the scroll position that will maintain the element in it's current viewport position,
// window scroll position = element's current document position - element's initial viewport position
export function maintainViewportPosition (elt, mocks={document, window}) {
  const elementsInitialPositionInViewport = elt.getBoundingClientRect().top;
  mocks.window.requestAnimationFrame(() => {
    const elementsNewPositionInViewport = elt.getBoundingClientRect().top;
    const documentPositionInViewport = mocks.document.documentElement.getBoundingClientRect().top;
    const elementPositionInDocument = elementsNewPositionInViewport - documentPositionInViewport;
    const newWindowScrollPosition = elementPositionInDocument - elementsInitialPositionInViewport;
    // always want this insta-scroll to happen first so later scroll animations will start in the right place.
    animationQueue.unshift(() => {
      mocks.window.scroll(0, newWindowScrollPosition);
    });
    mocks.window.requestAnimationFrame(runAnimationQueue);
  });
}

export function animateSlideDown (elt) {
  Velocity(elt, 'slideDown');
}

export function animateScroll (elt, offset) {
  animationQueue.push(() => {
    Velocity(elt, 'scroll', {offset: -offset});
  });
  window.requestAnimationFrame(runAnimationQueue);
}

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
