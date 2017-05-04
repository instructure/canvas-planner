import React from 'react';
import { shallow, mount } from 'enzyme';
import 'instructure-ui/lib/themes/canvas';
import UpdateItemTray from '../index';

const defaultProps = {
  onSavePlannerItem: () => {},
  onDeletePlannerItem: () => {},
  courses: [],
};

it('renders the base component correctly with one buttons and four inputs', () => {
  const wrapper = shallow(
    <UpdateItemTray {...defaultProps} />
  );
  expect(wrapper).toMatchSnapshot();
});

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

it('disables the save button when date is empty', () => {
  const item = { title: 'an item', date: '' };
  const wrapper = shallow(<UpdateItemTray {...defaultProps} noteItem={item} />);
  const button = wrapper.find('Button[variant="primary"]');
  expect(button.props().disabled).toBe(true);
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

it('does not set an initial error message on date', () => {
  const wrapper = shallow(<UpdateItemTray {...defaultProps} />);
  const dateInput = wrapper.find('TextInput').at(1);
  expect(dateInput.props().messages).toEqual([]);
});

it('sets error message on date field when date is set to blank', () => {
  const wrapper = shallow(<UpdateItemTray {...defaultProps} noteItem={{date: '2017-04-28'}} />);
  wrapper.instance().handleDateChange({target: {value: ''}});
  const dateInput = wrapper.find('TextInput').at(1);
  const messages = dateInput.props().messages;
  expect(messages).toHaveLength(1);
  expect(messages[0].type).toBe('error');
});

it('clears the error message when a date is typed in', () => {
  const wrapper = shallow(<UpdateItemTray {...defaultProps} noteItem={{date: '2017-04-28'}} />);
  wrapper.instance().handleTitleChange({target: {value: ''}});
  wrapper.instance().handleTitleChange({target: {value: '2'}});
  const dateInput = wrapper.find('TextInput').at(1);
  expect(dateInput.props().messages).toEqual([]);
});

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
  wrapper.instance().handleDateChange({target: {value: '2017-05-01'}});
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
