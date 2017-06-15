import React from 'react';
import { shallow } from 'enzyme';
import { Opportunity } from '../index';

function defaultProps (option) {
  return {
    id: "1",
    dueAt: "2017-03-09T20:40:35Z",
    courseName: "course about stuff",
    opportunityTitle: "this is a description about the opportunity",
    points: 20,
    url: "http://www.non_default_url.com",
    timeZone: 'America/Denver',
    dismiss: () => {},
  };
}

it('renders the base component correctly', () => {
  const wrapper = shallow(
    <Opportunity {...defaultProps()} />
  );
  expect(wrapper).toMatchSnapshot();
});

it('calls the onClick prop when dismissed is clicked', () => {
  let tempProps = defaultProps();
  tempProps.dismiss = jest.fn();
  const wrapper = shallow(
    <Opportunity {...tempProps}/>
  );
  wrapper.find('Button').simulate('click');
  expect(tempProps.dismiss).toHaveBeenCalled();
});

it('renders the base component correctly without points', () => {
  let tempProps = defaultProps();
  tempProps.points = null;
  const wrapper = shallow(
    <Opportunity {...tempProps} />
  );
  expect(wrapper).toMatchSnapshot();
});
