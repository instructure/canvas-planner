import React from 'react';
import { shallow } from 'enzyme';
import { TestComponent } from '../index';

it('renders correctly', () => {
  const wrapper = shallow(
    <TestComponent />
  )
  expect(wrapper).toMatchSnapshot();
});

it('renders the proper value', () => {
  const wrapper = shallow(
    <TestComponent value={100} />
  )
  expect(wrapper).toMatchSnapshot();
});

it('calls the onClick prop when the button is clicked', () => {
  const spy = jest.fn();
  const wrapper = shallow(
    <TestComponent onClick={spy} />
  );
  wrapper.find('Button').simulate('click');
  expect(spy).toHaveBeenCalled();
})
