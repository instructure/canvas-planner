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
import LoadingPastIndicator from '../index';
import {shallow, mount} from 'enzyme';

it('renders stuff', () => {
  const wrapper = shallow(<LoadingPastIndicator />);
  expect(wrapper).toMatchSnapshot();
});

it('invokes callback when about to unmount', () => {
  const mockFn = jest.fn();
  const wrapper = mount(<LoadingPastIndicator onComponentWillUnmount={mockFn} />);
  wrapper.unmount();
  expect(mockFn).toHaveBeenCalled();
});

it('does not crash if not given an unmount callback', () => {
  const wrapper = mount(<LoadingPastIndicator />);
  wrapper.unmount();
});
