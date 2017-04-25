import React from 'react';
import { shallow } from 'enzyme';
import 'instructure-ui/lib/themes/canvas';
import { PlannerHeader } from '../index';

it('renders the base component correctly with two buttons', () => {
  const wrapper = shallow(
    <PlannerHeader />
  );
  expect(wrapper).toMatchSnapshot();
});
