import React from 'react';
import { shallow } from 'enzyme';
import { Opportunity } from '../index';

const defaultProps = {
  dueAt: "2017-03-09T20:40:35Z",
  courseName: "course about stuff",
  opportunityTitle: "this is a description about the opportunity",
  points: 20,
  url: "http://www.non_default_url.com",
  timeZone: 'America/Denver',
};

it('renders the base component correctly', () => {
  const wrapper = shallow(
    <Opportunity {...defaultProps} />
  );
  expect(wrapper).toMatchSnapshot();
});

it('renders the base component correctly without points', () => {
  let tempProps = defaultProps;
  tempProps.points = null;
  const wrapper = shallow(
    <Opportunity {...tempProps} />
  );
  expect(wrapper).toMatchSnapshot();
});
