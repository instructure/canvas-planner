import React from 'react';
import LoadingPastIndicator from '../index';
import {shallow, mount} from 'enzyme';

it('renders stuff', () => {
  const wrapper = shallow(<LoadingPastIndicator />);
  expect(wrapper).toMatchSnapshot();
});

it('invokes callback when about to unmount', () => {
  const mockFn = jest.fn();
  const wrapper = mount(<LoadingPastIndicator onComponentWillUnmount={mockFn} />);
  wrapper.unmount();
  expect(mockFn).toHaveBeenCalled();
});

it('does not crash if not given an unmount callback', () => {
  const wrapper = mount(<LoadingPastIndicator />);
  wrapper.unmount();
});
