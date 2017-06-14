import React from 'react';
import StickyButton from '../index';
import {shallow} from 'enzyme';
import IconMoveUpLine from 'instructure-icons/lib/Line/IconMoveUpLine';
import IconMoveDownLine from 'instructure-icons/lib/Line/IconMoveDownLine';


it('renders', () => {
  const wrapper = shallow(<StickyButton>I am a Sticky Button</StickyButton>);
  expect(wrapper).toMatchSnapshot();
});

it('calls the onClick prop when clicked', () => {
  const fakeOnClick = jest.fn();
  const wrapper = shallow(
    <StickyButton onClick={fakeOnClick}>
      Click me
    </StickyButton>
  );

  wrapper.find('button').simulate('click');
  expect(fakeOnClick).toHaveBeenCalled();
});

it('does not call the onClick prop when disabled', () => {
  const fakeOnClick = jest.fn();
  const wrapper = shallow(
    <StickyButton onClick={fakeOnClick} disabled>
      Disabled button
    </StickyButton>
  );

  wrapper.find('button').simulate('click', {
    preventDefault() {},
    stopPropagation() {}
  });
  expect(fakeOnClick).not.toHaveBeenCalled();
});

it('renders the correct up icon', () => {
  const wrapper = shallow(
    <StickyButton direction="up">
      Click me
    </StickyButton>
  );
  expect(wrapper.find(IconMoveUpLine)).toHaveLength(1);
});

it('renders the correct down icon', () => {
  const wrapper = shallow(
    <StickyButton direction="down">
      Click me
    </StickyButton>
  );
  expect(wrapper.find(IconMoveDownLine)).toHaveLength(1);
});
