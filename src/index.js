import React from 'react';
import ReactDOM from 'react-dom';
import PlannerApp from './components/PlannerApp';

export default {
  render(element, options) {
    ReactDOM.render(<PlannerApp {...options} />, element);
  },
};
