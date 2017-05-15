import React from 'react';
import LoadingPastIndicator from '../index';
import {shallow} from 'enzyme';

it('renders stuff', () => {
  const wrapper = shallow(<LoadingPastIndicator />);
  expect(wrapper).toMatchSnapshot();
});
