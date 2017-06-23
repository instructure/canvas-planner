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
import {CompletedItemsFacade} from '../index';

it('renders as a div with a CheckboxFacade and a string of text indicating count', () => {
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

it('displays Pills when given them', () => {
  const wrapper = shallow(
    <CompletedItemsFacade
      onClick={() => {}}
      itemCount={3}
      badges={[{ text: 'New Grades' }]}
    />
  );

  expect(wrapper.find('Pill')).toHaveLength(1);
});

it('registers itself as animatable', () => {
  const fakeRegister = jest.fn();
  const wrapper = mount(
    <CompletedItemsFacade
      onClick={() => {}}
      registerAnimatable={fakeRegister}
      animatableIndex={42}
      animatableItemIds={['1', '2', '3']}
      itemCount={3}
    />
  );
  expect(fakeRegister).toHaveBeenCalledWith('item', wrapper.instance(), 42, ['1', '2', '3']);

  wrapper.setProps({animatableItemIds: ['2', '3', '4']});
  expect(fakeRegister).toHaveBeenCalledWith('item', null, 42, ['1', '2', '3']);
  expect(fakeRegister).toHaveBeenCalledWith('item', wrapper.instance(), 42, ['2', '3', '4']);

  wrapper.unmount();
  expect(fakeRegister).toHaveBeenCalledWith('item', null, 42, ['2', '3', '4']);
});
