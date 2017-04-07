import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import 'instructure-ui/lib/themes/canvas'
import ApplyTheme from 'instructure-ui/lib/components/ApplyTheme'
import PlannerApp from './components/PlannerApp';
import i18n from './i18n';
import configureStore from './store/configureStore';

const defaultOptions = {
  locale: 'en',
  theme: 'canvas'
};



export default {
  render (element, options) {
    // Using this pattern because default params don't merge objects
    const opts = { ...defaultOptions, ...options };
    i18n.init(opts.locale);
    ApplyTheme.setDefaultTheme(opts.theme);

    const store = configureStore();

    ReactDOM.render(
      <Provider store={store}>
          <PlannerApp />
      </Provider>
      , element);
  },
};
