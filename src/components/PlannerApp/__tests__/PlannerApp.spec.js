import React from 'react';
import { shallow } from 'enzyme';
import { PlannerApp } from '../index';

const getDefaultValues = (overrides) => (
  Object.assign({}, {
    days: [
      ["2017-04-24", [{}]],
      ["2017-04-25", [{}]],
      ["2017-04-26", [{}]],
    ],
    timeZone: "UTC"
  }, overrides)
);

it('renders base component using dayKeys', () => {
  const wrapper = shallow(
    <PlannerApp {...getDefaultValues()} />
  );
  expect(wrapper).toMatchSnapshot();
});

it('shows only the loading component when the isLoading prop is true', () => {
  const wrapper = shallow(
    <PlannerApp
      {...getDefaultValues()}
      isLoading={true}
    />
  );
  expect(wrapper).toMatchSnapshot();
});
