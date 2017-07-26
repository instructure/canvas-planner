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
import moment from 'moment-timezone';
import { shallow } from 'enzyme';
import { PlannerApp } from '../index';

const getDefaultValues = (overrides) => (
  Object.assign({}, {
    days: [
      ["2017-04-24", [{dateBucketMoment: moment.tz('2017-04-24', 'Asia/Tokyo')}]],
      ["2017-04-25", [{dateBucketMoment: moment.tz('2017-04-25', 'Asia/Tokyo')}]],
      ["2017-04-26", [{dateBucketMoment: moment.tz('2017-04-26', 'Asia/Tokyo')}]],
    ],
    timeZone: "UTC",
    changeToDashboardCardView () {}
  }, overrides)
);

it('renders base component using dayKeys', () => {
  const wrapper = shallow(
    <PlannerApp {...getDefaultValues()} />
  );
  expect(wrapper).toMatchSnapshot();
});

it('renders empty component with no assignments', () => {
  var opts = getDefaultValues();
  opts.days = [];
  const wrapper = shallow(
    <PlannerApp {...opts}/>
  );
  expect(wrapper.find('PlannerEmptyState').exists()).toBeTruthy();
});

it('shows only the loading component when the isLoading prop is true', () => {
  const wrapper = shallow(
    <PlannerApp
      {...getDefaultValues()}
      isLoading={true}
    />
  );
  expect(wrapper).toMatchSnapshot();
});

it('shows the loading past indicator when loadingPast prop is true', () => {
  const wrapper = shallow(
    <PlannerApp
      {...getDefaultValues()}
      loadingPast={true}
    />
  );
  expect(wrapper).toMatchSnapshot();
});

it('passes takeFocusRef to first day that matches firstNewDayKey if setFocusAfterLoad', () => {
  const wrapper = shallow(<PlannerApp {...getDefaultValues()}
    firstNewDayKey="2017-04-25" setFocusAfterLoad />);
  expect(wrapper).toMatchSnapshot();
});

it('does not pass takeFocusRef to first day that matches firstNewDayKey if not setFocusAfterLoad', () => {
  const wrapper = shallow(<PlannerApp {...getDefaultValues()}
    firstNewDayKey="2017-04-25" />);
  expect(wrapper).toMatchSnapshot();
});

it('calls focus() on takeFocusRef', () => {
  const mockFocusElement = { focus: jest.fn() };
  const wrapper = shallow(<PlannerApp {...getDefaultValues()} />);
  wrapper.instance().takeFocusRef(mockFocusElement);
  expect(mockFocusElement.focus).toHaveBeenCalled();
});

it('shows new activity button when new activity is indicated', () => {
  const wrapper = shallow(<PlannerApp {...getDefaultValues()} firstNewActivityDate={moment('2017-03-30')} />);
  expect(wrapper).toMatchSnapshot();
});

it('shows new activity button when there is new activity, but no current items', () => {
  const wrapper = shallow(
    <PlannerApp
      days={[]}
      timeZone="UTC"
      changeToDashboardCardView={() => {}}
      firstNewActivityDate={moment().add(-1, 'days')}
    />);
  expect(wrapper.find('StickyButton')).toHaveLength(1);
});
