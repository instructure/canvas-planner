import CanvasPlanner from '../index';
import moxios from 'moxios';

describe('with mock api', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="container"></div>';
    moxios.install();
  });

  afterEach(() => {
    moxios.uninstall();
  });

  describe('render', () => {
    it('calls render with PlannerApp', () => {
      CanvasPlanner.render(document.getElementById('container'), {
        flashAlertFunctions: {}
      });
      expect(document.querySelector('.PlannerApp')).toBeTruthy();
    });

    it('throws an error if flashAlertFunctions are not provided', () => {
      expect(() => {
        CanvasPlanner.render(document.getElementById('container'));
      }).toThrow();
    });
  });

  describe('renderHeader', () => {
    beforeEach(() => {
      document.body.innerHTML = '<div id="header_container"></div>';
      moxios.install();
    });

    afterEach(() => {
      moxios.uninstall();
    });

    it('calls render with PlannerHeader', () => {
      CanvasPlanner.renderHeader(document.getElementById('header_container'));
      // This assertion is a bit odd, we need to get class names working with
      // CSS modules under test then we can be more clear here.
      expect(document.querySelector('#header_container div')).toBeTruthy();
    });
  });
});
