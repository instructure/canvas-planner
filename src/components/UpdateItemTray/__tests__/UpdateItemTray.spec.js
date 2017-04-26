import React from 'react';
import { shallow, mount } from 'enzyme';
import 'instructure-ui/lib/themes/canvas';
import UpdateItemTray from '../index';

it('renders the base component correctly with one buttons and four inputs', () => {
  const wrapper = shallow(
    <UpdateItemTray />
  );
  expect(wrapper).toMatchSnapshot();
});

it('renders the item to update if provided', () => {
  const noteItem = {
    title: 'Planner Item',
    date: '2017-04-25 01:49:00-0700',
    courseId: '1',
    details: "You made this item to remind you of something, but you forgot what."
  };
  const wrapper = shallow(
    <UpdateItemTray noteItem={noteItem} />
  );
  expect(wrapper).toMatchSnapshot();
});

it('shows title inputs', () => {
  const wrapper = mount(
    <UpdateItemTray />
  );
  expect(wrapper.find('TextInput')).toHaveLength(2);
  const input = wrapper.find('TextInput').first();
  input.find('input').simulate('change', {target: {value: 'New Text'}});
  expect(input.props().value).toEqual('New Text');
});

it('shows details inputs', () => {
  const wrapper = mount(
    <UpdateItemTray />
  );
  const input = wrapper.find('TextArea');
  input.find('textarea').simulate('change', {target: {value: 'New Details'}});
  expect(input.props().value).toEqual('New Details');
});
