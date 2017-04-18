import React from 'react';
import { shallow } from 'enzyme';
import 'instructure-ui/lib/themes/canvas';
import { ThemeablePlaceholder as Placeholder } from '../index';

it('renders correctly', () => {
  const wrapper = shallow(
    <Placeholder />
  )
  expect(wrapper).toMatchSnapshot();
});

it('renders the proper value', () => {
  const wrapper = shallow(
    <Placeholder value={100} />
  )
  expect(wrapper).toMatchSnapshot();
});

it('calls the onClick prop when the button is clicked', () => {
  const spy = jest.fn();
  const wrapper = shallow(
    <Placeholder onClick={spy} />
  );
  wrapper.find('Button').simulate('click');
  expect(spy).toHaveBeenCalled();
})
