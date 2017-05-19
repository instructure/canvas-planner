import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import PlannerApp from './components/PlannerApp';
import PlannerHeader from './components/PlannerHeader';
import ApplyTheme from 'instructure-ui/lib/components/ApplyTheme';
import i18n from './i18n';
import configureStore from './store/configureStore';
import { initialOptions, getPlannerItems } from './actions';
import moment from 'moment-timezone';

const defaultOptions = {
  locale: 'en',
  timeZone: moment.tz.guess(),
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
    moment.tz.setDefault(opts.timeZone);
    store.dispatch(initialOptions(opts));

    store.dispatch(getPlannerItems(moment.tz(opts.timeZone).startOf('day')));

    ReactDOM.render(applyTheme(
      <Provider store={store}>
          <PlannerApp />
      </Provider>
    , opts.theme), element);
  },

  // This method allows you to render the header items into a separate DOM node
  renderHeader (element, options) {
    // Using this pattern because default params don't merge objects
    const opts = { ...defaultOptions, ...options };

    ReactDOM.render(applyTheme(
      <Provider store={store}>
        <PlannerHeader timeZone={opts.timeZone} locale={opts.locale}/>
      </Provider>
    , opts.theme), element);
  }
};

function applyTheme (el, theme) {
  return theme ? (
    <ApplyTheme
      theme={ApplyTheme.generateTheme(theme.key)}
      immutable={theme.accessible}
    >
      {el}
    </ApplyTheme>
  ): el;
}
