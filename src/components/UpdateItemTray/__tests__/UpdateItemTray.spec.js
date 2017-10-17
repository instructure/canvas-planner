/*
 * Copyright (C) 2017 - present Instructure, Inc.
 *
 * This module is part of Canvas.
 *
 * This module and Canvas are free software: you can redistribute them and/or modify them under
 * the terms of the GNU Affero General Public License as published by the Free
 * Software Foundation, version 3 of the License.
 *
 * This module and Canvas are distributed in the hope that they will be useful, but WITHOUT ANY
 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
 * A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
 * details.
 *
 * You should have received a copy of the GNU Affero General Public License along
 * with this program. If not, see <http://www.gnu.org/licenses/>.
 */
import React from 'react';
import { shallow, mount } from 'enzyme';
import UpdateItemTray from '../index';

function makeLocalISODateString(date) {
  const d = new Date(date);
  const tzo = -d.getTimezoneOffset();
  const dif = tzo >= 0 ? '+' : '-';
  const pad = function (num) {
    const norm = Math.floor(Math.abs(num));
    return (norm < 10 ? '0' : '') + norm;
  };
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T` +
         `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}${dif}${pad(tzo / 60)}:${pad(tzo % 60)}`;
 }
const defaultProps = {
  onSavePlannerItem: () => {},
  locale: 'en',
  timeZone: 'America/Denver',
  onDeletePlannerItem: () => {},
  courses: [],
};

it('renders the item to update if provided', () => {
  const noteItem = {
    title: 'Planner Item',
    date: '2017-04-25 01:49:00-0700',
    context: {courseId: '1'},
    details: "You made this item to remind you of something, but you forgot what."
  };
  const wrapper = shallow(
    <UpdateItemTray {...defaultProps}
      noteItem={noteItem}
      courses={[{id: '1', longName: 'a course'}]} />
  );
  expect(wrapper).toMatchSnapshot();
});

it('renders Add To Do header when creating a new to do', () => {
  const wrapper = mount(
    <UpdateItemTray {...defaultProps} />
  );

  expect(wrapper.find('h2').text()).toBe('Add To Do');
});

it('shows title inputs', () => {
  const wrapper = mount(
    <UpdateItemTray {...defaultProps} />
  );
  expect(wrapper.find('TextInput')).toHaveLength(2);
  const input = wrapper.find('TextInput').first();
  input.find('input').simulate('change', {target: {value: 'New Text'}});
  expect(input.props().value).toEqual('New Text');
});

it('shows details inputs', () => {
  const wrapper = mount(
    <UpdateItemTray {...defaultProps} />
  );
  const input = wrapper.find('TextArea');
  input.find('textarea').simulate('change', {target: {value: 'New Details'}});
  expect(input.props().value).toEqual('New Details');
});

it('disables the save button when title is empty', () => {
  const item = { title: '', date: '2017-04-28' };
  const wrapper = shallow(<UpdateItemTray {...defaultProps} noteItem={item} />);
  const button = wrapper.find('Button[variant="primary"]');
  expect(button.props().disabled).toBe(true);
});

it('handles courseid being none', () => {
  const item = { title: '', date: '2017-04-28' };
  const wrapper = shallow(<UpdateItemTray {...defaultProps} noteItem={item} />);
  wrapper.instance().handleCourseIdChange({target: {value: 'none'}});
  expect(wrapper.instance().state.updates.courseId).toBe(undefined);
});

it('sets default date when no date is provided', () => {
  const item = { title: 'an item', date: '' };
  const wrapper = shallow(<UpdateItemTray {...defaultProps} noteItem={item} />);
  const datePicker = wrapper.find('DateInput');
  expect(!datePicker.props().defaultDateValue.length).toBe(false);
});

it('enables the save button when title and date are present', () => {
  const item = { title: 'an item', date: '2017-04-28' };
  const wrapper = shallow(<UpdateItemTray {...defaultProps} noteItem={item} />);
  const button = wrapper.find('Button[variant="primary"]');
  expect(button.props().disabled).toBe(false);
});

it('does not set an initial error message on title', () => {
  const wrapper = shallow(<UpdateItemTray {...defaultProps} />);
  const titleInput = wrapper.find('TextInput').first();
  expect(titleInput.props().messages).toEqual([]);
});

it('sets error message on title field when title is set to blank', () => {
  const wrapper = shallow(<UpdateItemTray {...defaultProps} noteItem={{title: 'an item'}} />);
  wrapper.instance().handleTitleChange({target: {value: ''}});
  const titleInput = wrapper.find('TextInput').first();
  const messages = titleInput.props().messages;
  expect(messages).toHaveLength(1);
  expect(messages[0].type).toBe('error');
});

it('clears the error message when a title is typed in', () => {
  const wrapper = shallow(<UpdateItemTray {...defaultProps} noteItem={{title: 'an item'}} />);
  wrapper.instance().handleTitleChange({target: {value: ''}});
  wrapper.instance().handleTitleChange({target: {value: 't'}});
  const titleInput = wrapper.find('TextInput').first();
  expect(titleInput.props().messages).toEqual([]);
});

// The Date picker does not support error handeling yet we are working with instui to get it working
xit('does not set an initial error message on date', () => {
  const wrapper = shallow(<UpdateItemTray {...defaultProps} />);
  const dateInput = wrapper.find('TextInput').at(1);
  expect(dateInput.props().messages).toEqual([]);
});

xit('sets error message on date field when date is set to blank', () => {
  const wrapper = shallow(<UpdateItemTray {...defaultProps} noteItem={{date: '2017-04-28'}} />);
  wrapper.instance().handleDateChange({target: {value: ''}});
  const dateInput = wrapper.find('TextInput').at(1);
  const messages = dateInput.props().messages;
  expect(messages).toHaveLength(1);
  expect(messages[0].type).toBe('error');
});

xit('clears the error message when a date is typed in', () => {
  const wrapper = shallow(<UpdateItemTray {...defaultProps} noteItem={{date: '2017-04-28'}} />);
  wrapper.instance().handleTitleChange({target: {value: ''}});
  wrapper.instance().handleTitleChange({target: {value: '2'}});
  const dateInput = wrapper.find('TextInput').at(1);
  expect(dateInput.props().messages).toEqual([]);
});

it('changes state when new date is typed in', () => {
  const noteItem = {
    title: 'Planner Item',
    date: '2017-04-25 01:49:00-0700',
  };
  const mockCallback = jest.fn();
  const wrapper = mount(<UpdateItemTray {...defaultProps} onSavePlannerItem={mockCallback} noteItem={noteItem} />);
  const newDate = new Date('2017-10-16');
  const dateInput = wrapper.find('DateInput');
  const rawInput = dateInput.find('input');
  rawInput.simulate('change', {target: {value: newDate.toISOString()}});
  wrapper.instance().handleSave();
  expect(mockCallback).toHaveBeenCalledWith({
    title: noteItem.title,
    date: makeLocalISODateString(newDate)
  });
});

//------------------------------------------------------------------------

it('does not render the delete button if an item is not specified', () => {
  const wrapper = shallow(<UpdateItemTray {...defaultProps} />);
  const deleteButton = wrapper.find('Button[variant="light"]');
  expect(deleteButton).toHaveLength(0);
});

it('does render the delete button if an item is specified', () => {
  const wrapper = shallow(<UpdateItemTray {...defaultProps} noteItem={{title: 'some note'}} />);
  const deleteButton = wrapper.find('Button[variant="light"]');
  expect(deleteButton).toHaveLength(1);
});

it('renders just an optional option when no courses', () => {
  const wrapper = shallow(<UpdateItemTray {...defaultProps} />);
  expect(wrapper.find('option')).toHaveLength(1);
});

it('renders course options plus an optional option when provided with courses', () => {
  const wrapper = shallow(<UpdateItemTray {...defaultProps} courses={[
    {id: '1', longName: 'first course'},
    {id: '2', longName: 'second course'},
  ]} />);
  expect(wrapper.find('option')).toHaveLength(3);
});

it('invokes save callback with updated data', () => {
  const saveMock = jest.fn();
  const wrapper = shallow(<UpdateItemTray {...defaultProps}
    noteItem={{
      title: 'title', date: '2017-04-27', courseId: '42', details: 'details',
    }}
    courses={[{id: '42', longName: 'first'}, {id: '43', longName: 'second'}]}
    onSavePlannerItem={saveMock}
  />);
  wrapper.instance().handleTitleChange({target: {value: 'new title'}});
  wrapper.instance().handleDateChange({}, '2017-05-01');
  wrapper.instance().handleCourseIdChange({target: {value: '43'}});
  wrapper.instance().handleChange('details', 'new details');
  wrapper.instance().handleSave();
  expect(saveMock).toHaveBeenCalledWith({
    title: 'new title', date: '2017-05-01', context: {id: '43'}, details: 'new details',
  });
});

it('invokes the delete callback', () => {
  const mockDelete = jest.fn();
  const wrapper = shallow(<UpdateItemTray {...defaultProps}
    noteItem={{title: 'a title'}}
    onDeletePlannerItem={mockDelete} />);
  wrapper.instance().handleDeleteClick();
  expect(mockDelete).toHaveBeenCalledWith({title: 'a title'});
});
