import React from 'react';
import ReactDOM from 'react-dom';
import PlannerApp from './components/PlannerApp';
import i18n from './i18n'


export default {
  render(element, options) {
    i18n.init('en')// TODO: pass actual local here
    ReactDOM.render(<PlannerApp {...options} />, element);
  },
};
