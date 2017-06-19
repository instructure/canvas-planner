import React from 'react';
import { shallow, mount } from 'enzyme';
import { Opportunities } from '../index';

function defaultProps (option) {
  return {
    opportunities: [{id: "1", course_id: "1", due_at: "2017-03-09T20:40:35Z", html_url: "http://www.non_default_url.com", name: "learning object title"}],
    courses: [{id: "1", shortName: "Course Short Name"}],
    timeZone: 'America/Denver',
    dismiss: () => {},
    id: "6",
    togglePopover: () => {},
  };
}

jest.useFakeTimers();

it('renders the base component correctly with one opportunity', () => {
  const wrapper = shallow(
    <Opportunities {...defaultProps()} />
  );
  expect(wrapper).toMatchSnapshot();
});

it('renders the right course with the right opportunity', () => {
  let tempProps = defaultProps();
  tempProps.opportunities = tempProps.opportunities.concat({id: "2", course_id: "2", html_url: "http://www.non_default_url.com", due_at: "2017-03-09T20:40:35Z", name: "other learning object"});
  tempProps.courses = tempProps.courses.concat({id: "2", shortName: "A different Course Name"});
  const wrapper = shallow(
    <Opportunities {...tempProps} />
  );
  expect(wrapper).toMatchSnapshot();
});

it('renders nothing if no opportunities', () => {
  let tempProps = defaultProps();
  tempProps.opportunities = [];
  const wrapper = shallow(<Opportunities {...tempProps} />);
  expect(wrapper).toMatchSnapshot();
});

it('calls toggle popover when escape is pressed', () => {
  let tempProps = defaultProps();
  const mockDispatch = jest.fn();
  tempProps.togglePopover = mockDispatch;
  const wrapper = shallow(
    <Opportunities {...tempProps} />
  );
  wrapper.find("#opportunities_parent").simulate("keyDown", {
    keyCode: 27,
    which: 27,
    key: "escape",
    preventDefault: () => {},
  });
  expect(tempProps.togglePopover).toHaveBeenCalled();
});

it('calls setTimeout when component is mounted', () => {
  mount(
    <Opportunities {...defaultProps()} />
  );
  expect(setTimeout.mock.calls.length).toBe(1);
  expect(setTimeout.mock.calls[0][1]).toBe(200);
  jest.runAllTimers();
});


