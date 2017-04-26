import React from 'react';
import { shallow, mount } from 'enzyme';
import 'instructure-ui/lib/themes/canvas';
import { PlannerHeader } from '../index';

it('renders the base component correctly with two buttons and a tray', () => {
  const wrapper = shallow(
    <PlannerHeader />
  );
  expect(wrapper).toMatchSnapshot();
});

it('toggles the new item tray', () => {
  const wrapper = mount(
    <PlannerHeader />
  );
  const button = wrapper.find('[children="Add Note to Self"]');
  button.simulate('click');
  expect(wrapper.find('Tray').props().isOpen).toEqual(true);
  button.simulate('click');
  expect(wrapper.find('Tray').props().isOpen).toEqual(false);
});

it('sends focus back to the add new item button', () => {
  const wrapper = mount(
    <PlannerHeader />
  );
  wrapper.setState({trayOpen: true});
  const btn = wrapper.instance().addNoteBtn;
  wrapper.instance().noteBtnOnClose();
  expect(btn.focused).toBe(true);
});
