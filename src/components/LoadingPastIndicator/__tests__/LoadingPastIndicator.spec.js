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
import {shallow} from 'enzyme';

it('renders very little', () => {
  const wrapper = shallow(<LoadingPastIndicator />);
  expect(wrapper).toMatchSnapshot();
});

it('renders spinner while loading', () => {
  const wrapper = shallow(<LoadingPastIndicator loadingPast={true} />);
  expect(wrapper).toMatchSnapshot();
});

it('still renders loading even when no more items in the past', () => {
  const wrapper = shallow(<LoadingPastIndicator loadingPast={true} allPastItemsLoaded={true} />);
  expect(wrapper).toMatchSnapshot();
});

it('renders TV when all past items loaded', () => {
  const wrapper = shallow(<LoadingPastIndicator allPastItemsLoaded={true} />);
  expect(wrapper).toMatchSnapshot();
});
