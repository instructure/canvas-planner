import React from 'react';
import { shallow, mount } from 'enzyme';
import { PlannerHeader } from '../index';

const defaultProps = {
  courses: [],
  savePlannerItem: () => {},
  locale: 'en',
  timeZone: 'America/Denver',
  deletePlannerItem: () => {},
};

it('renders the base component correctly with two buttons and a tray', () => {
  const wrapper = shallow(
    <PlannerHeader {...defaultProps} />
  );
  expect(wrapper).toMatchSnapshot();
});

it('toggles the new item tray', () => {
  const wrapper = mount(
    <PlannerHeader {...defaultProps} />
  );
  const button = wrapper.find('[children="Add Note to Self"]');
  button.simulate('click');
  expect(wrapper.find('Tray').props().isOpen).toEqual(true);
  button.simulate('click');
  expect(wrapper.find('Tray').props().isOpen).toEqual(false);
});

it('sends focus back to the add new item button', () => {
  const wrapper = mount(
    <PlannerHeader {...defaultProps} />
  );
  wrapper.setState({trayOpen: true});
  const btn = wrapper.instance().addNoteBtn;
  wrapper.instance().noteBtnOnClose();
  expect(btn.focused).toBe(true);
});
