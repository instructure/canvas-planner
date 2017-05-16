import React from 'react';
import { shallow } from 'enzyme';
import CompletedItemsFacade from '../index';

it('renders as an li with a CheckboxFacade and a string of text indicating count', () => {
  const wrapper = shallow(
    <CompletedItemsFacade
      onClick={() => {}}
      itemCount={3}
    />
  );
  expect(wrapper).toMatchSnapshot();
});

it('calls the onClick prop when clicked', () => {
  const fakeOnClick = jest.fn();
  const wrapper = shallow(
    <CompletedItemsFacade
      onClick={fakeOnClick}
      itemCount={0}
    />
  );

  wrapper.find('button').simulate('click');
  expect(fakeOnClick).toHaveBeenCalled();
});
