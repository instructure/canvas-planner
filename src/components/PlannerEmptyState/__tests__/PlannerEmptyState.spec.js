import React from 'react';
import { shallow } from 'enzyme';
import PlannerEmptyState from '../index';

it('renders empty page', () => {
  const wrapper = shallow(<PlannerEmptyState changeToDashboardCardView={() => {}} />, );
  expect(wrapper).toMatchSnapshot();
});
