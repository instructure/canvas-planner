import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import PlannerApp from './components/PlannerApp';
import PlannerHeader from './components/PlannerHeader';
import ApplyTheme from 'instructure-ui/lib/components/ApplyTheme';
import i18n from './i18n';
import configureStore from './store/configureStore';
import { initialOptions, getPlannerItems, scrollIntoPast } from './actions';
import { registerScrollEvents } from './utilities/scrollUtils';
import { initialize as initializeAlerts } from './utilities/alertUtils';
import moment from 'moment-timezone';

const defaultOptions = {
  locale: 'en',
  timeZone: moment.tz.guess(),
  theme: 'canvas',
  courses: [],
  stickyOffset: '0',
  stickyZIndex: 5,
};

export const store = configureStore();

function handleScrollIntoPastAttempt () {
  store.dispatch(scrollIntoPast());
}

export default {
  render (element, options) {
    // Using this pattern because default params don't merge objects
    const opts = { ...defaultOptions, ...options };
    i18n.init(opts.locale);
    moment.locale(opts.locale);
    moment.tz.setDefault(opts.timeZone);
    registerScrollEvents(handleScrollIntoPastAttempt);
    if (!opts.flashAlertFunctions) {
      throw new Error('You must provide callbacks to handle flash messages');
    }
    initializeAlerts(opts.flashAlertFunctions);

    store.dispatch(initialOptions(opts));
    store.dispatch(getPlannerItems(moment.tz(opts.timeZone).startOf('day')));

    ReactDOM.render(applyTheme(
      <Provider store={store}>
          <PlannerApp stickyOffset={opts.stickyOffset} stickyZIndex={opts.stickyZIndex} changeToDashboardCardView={opts.changeToDashboardCardView} />
      </Provider>
    , opts.theme), element);
  },

  // This method allows you to render the header items into a separate DOM node
  renderHeader (element, options) {
    // Using this pattern because default params don't merge objects
    const opts = { ...defaultOptions, ...options };

    ReactDOM.render(applyTheme(
      <Provider store={store}>
        <PlannerHeader timeZone={opts.timeZone} locale={opts.locale} />
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
