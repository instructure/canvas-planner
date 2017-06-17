import React from 'react';
import { shallow, mount } from 'enzyme';
import ShowOnFocusButton from '../index';

it('renders a ScreenReaderContent by default',  () => {
  const wrapper = shallow(
    <ShowOnFocusButton>Button</ShowOnFocusButton>
  );

  expect(wrapper).toMatchSnapshot();
});

it('renders a Button when it has focus', () => {
  const wrapper = mount(
    <ShowOnFocusButton>Button</ShowOnFocusButton>
  );

  wrapper.find('Button').simulate('focus');
  expect(wrapper.find('ScreenReaderContent').exists()).toBe(false);
});

it('renders ScreeenReaderContent after blur', () => {
  const wrapper = mount(
    <ShowOnFocusButton>Button</ShowOnFocusButton>
  );

  wrapper.find('Button').simulate('focus');
  expect(wrapper.find('ScreenReaderContent').exists()).toBe(false);

  wrapper.find('Button').simulate('blur');
  expect(wrapper.find('ScreenReaderContent').exists()).toBe(true);
});
