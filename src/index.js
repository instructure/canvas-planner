import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import 'instructure-ui/lib/themes/canvas';
import ApplyTheme from 'instructure-ui/lib/components/ApplyTheme';
import PlannerApp from './components/PlannerApp';
import PlannerHeader from './components/PlannerHeader';
import i18n from './i18n';
import configureStore from './store/configureStore';
import { initializeCourses, getPlannerItems } from './actions';
import moment from 'moment-timezone';

const defaultOptions = {
  locale: 'en',
  timeZone: 'America/Denver',
  theme: 'canvas',
  courses: [],
};

export const store = configureStore();

export default {
  render (element, options) {
    // Using this pattern because default params don't merge objects
    const opts = { ...defaultOptions, ...options };
    i18n.init(opts.locale);
    moment.locale(opts.locale);
    ApplyTheme.setDefaultTheme(opts.theme);

    store.dispatch(initializeCourses(opts.courses));
    store.dispatch(getPlannerItems());

    ReactDOM.render(
      <Provider store={store}>
          <PlannerApp timeZone={opts.timeZone} />
      </Provider>
      , element);
  },

  // This method allows you to render the header items into a separate DOM node
  renderHeader (element) {
    ReactDOM.render(
      <Provider store={store}>
        <PlannerHeader />
      </Provider>
    , element);
  }
};
