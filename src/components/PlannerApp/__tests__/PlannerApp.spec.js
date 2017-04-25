import React from 'react';
import { shallow } from 'enzyme';
import 'instructure-ui/lib/themes/canvas';
import { PlannerApp } from '../index';

const getDefaultValues = (overrides) => (
  Object.assign({}, {
    dayKeys: ["2017-04-24", "2017-04-25", "2017-04-26"],
    days: {
      "2017-04-24": [{}],
      "2017-04-25": [{}],
      "2017-04-26": [{}]
    },
    timeZone: "en"
  }, overrides)
);

it('renders base component using dayKeys', () => {
  const wrapper = shallow(
    <PlannerApp {...getDefaultValues()} />
  );
  expect(wrapper).toMatchSnapshot();
});
