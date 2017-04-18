import React from 'react';
import { shallow } from 'enzyme';
import 'instructure-ui/lib/themes/canvas';
import PlannerApp from '../index';

it('renders correctly', () => {
  const wrapper = shallow(
    <PlannerApp />
  )
  expect(wrapper).toMatchSnapshot();
});
