import CanvasPlanner from '../index';
import moxios from 'moxios';

describe('render', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="container"></div>';
    moxios.install();
  });

  afterEach(() => {
    moxios.uninstall();
  });

  it('calls render with PlannerApp', () => {
    CanvasPlanner.render(document.getElementById('container'));
    expect(document.querySelector('.PlannerApp')).toBeTruthy();
  });
});

describe('renderHeader', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="header_container"></div>';
  });

  it('calls render with PlannerHeader', () => {
    CanvasPlanner.renderHeader(document.getElementById('header_container'));
    // This assertion is a bit odd, we need to get class names working with
    // CSS modules under test then we can be more clear here.
    expect(document.querySelector('#header_container div')).toBeTruthy();
  });
});
