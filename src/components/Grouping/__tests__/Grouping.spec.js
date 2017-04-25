import React from 'react';
import 'instructure-ui/lib/themes/canvas';
import { shallow } from 'enzyme';
import Grouping from '../index';

it('renders the base component with required props', () => {
  const items = [{
    id: 5,
    title: 'San Juan',
    date: "2017-04-25",
    context: {
      url: 'claysmellsgood',
      color: "#5678",
      id: 256
    }
  }, {
    id: 6,
    date: "2017-04-25",
    title: 'Roll for the Galaxy',
    context: {
      color: "#5678",
      id: 256
    }
  }];
  const wrapper = shallow(
    <Grouping timeZone="America/Denver" items={items} courseInfo={items[0].context} />
  );
  expect(wrapper).toMatchSnapshot();
});

