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
import {shallow} from 'enzyme';
import LoadingFutureIndicator from '../index';

it('renders load more by default', () => {
  const wrapper = shallow(<LoadingFutureIndicator />);
  expect(wrapper).toMatchSnapshot();
});

it('renders loading when indicated', () => {
  const wrapper = shallow(<LoadingFutureIndicator loadingFuture />);
  expect(wrapper).toMatchSnapshot();
});

it('renders all future items loaded regardless of other props', () => {
  const wrapper = shallow(<LoadingFutureIndicator loadingFuture allFutureItemsLoaded />);
  expect(wrapper).toMatchSnapshot();
});

it('invokes the callback when the waypoint is triggered', () => {
  const mockLoad = jest.fn();
  const wrapper = shallow(<LoadingFutureIndicator onLoadMore={mockLoad} />);
  wrapper.instance().handleWaypoint();
  expect(mockLoad).toHaveBeenCalledWith();
});

it('invokes the callback when loading more button is clicked', () => {
  const mockLoad = jest.fn();
  const wrapper = shallow(<LoadingFutureIndicator onLoadMore={mockLoad} />);
  wrapper.find('Button').simulate('click');
  expect(mockLoad).toHaveBeenCalledWith({});
});
