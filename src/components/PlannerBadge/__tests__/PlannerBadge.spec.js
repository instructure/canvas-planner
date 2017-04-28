import React from 'react';
import { shallow } from 'enzyme';
import 'instructure-ui/lib/themes/canvas';
import { PlannerBadge } from '../index';

it('renders the base component', () => {
  const wrapper = shallow(
    <PlannerBadge>
      <span>Hello</span>
    </PlannerBadge>
  );
  expect(wrapper).toMatchSnapshot();
});

it('renders the count when it is provided as a prop', () => {
  const wrapper = shallow(
    <PlannerBadge count={40}>
      <span>Hello</span>
    </PlannerBadge>
  );
  expect(wrapper).toMatchSnapshot();
  expect(wrapper.find('span').length).toEqual(4);
});

it('does not render the count when it is zero', () => {
  const wrapper = shallow(
    <PlannerBadge count={0}>
      <span>Hello</span>
    </PlannerBadge>
  );
  expect(wrapper.find('PresentationContent').length).toEqual(0);
  expect(wrapper.find('span').length).toEqual(3);
});
