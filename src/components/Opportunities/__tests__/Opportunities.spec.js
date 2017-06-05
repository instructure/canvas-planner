import React from 'react';
import { shallow } from 'enzyme';
import { Opportunities } from '../index';

function defaultProps (option) {
  return {
    opportunities: [{id: 1, course_id: 1, due_at: "2017-03-09T20:40:35Z", html_url: "http://www.non_default_url.com", name: "learning object title"}],
    courses: [{id: 1, shortName: "Course Short Name"}],
    timeZone: 'America/Denver',
  };
}

it('renders the base component correctly with one opportunity', () => {
  const wrapper = shallow(
    <Opportunities {...defaultProps()} />
  );
  expect(wrapper).toMatchSnapshot();
});

it('renders the right course with the right opportunity', () => {
  let tempProps = defaultProps();
  tempProps.opportunities = tempProps.opportunities.concat({id: 2, course_id: 2, html_url: "http://www.non_default_url.com", due_at: "2017-03-09T20:40:35Z", name: "other learning object"});
  tempProps.courses = tempProps.courses.concat({id: 2, shortName: "A different Course Name"});
  const wrapper = shallow(
    <Opportunities {...tempProps} />
  );
  expect(wrapper).toMatchSnapshot();
});

