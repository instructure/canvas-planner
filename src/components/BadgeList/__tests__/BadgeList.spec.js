import React from 'react';
import { shallow } from 'enzyme';
import BadgeList from '../index';
import Pill from 'instructure-ui/lib/components/Pill';

it('renders Pill components as list items', () => {
  const wrapper = shallow(
    <BadgeList>
      <Pill text="Pill 1" />
      <Pill text="Pill 2" />
      <Pill text="Pill 3" />
    </BadgeList>
  );
  expect(wrapper).toMatchSnapshot();
});
