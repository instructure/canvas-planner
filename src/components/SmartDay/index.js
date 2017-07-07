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
import {bool, number, string, func} from 'prop-types';
import _ from 'lodash';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { updateTodo } from '../../actions';
import { isToday, isInFuture } from '../../utilities/dateUtils';
import { anyNewActivity } from '../../utilities/statusUtils';
import { animateScroll } from '../../utilities/scrollUtils';
import Day from '../Day';

export const getLastUnseenDayKeyWithNewActivity = createSelector(
  [state => state.days],
  (days) => {
    let lastDayWithNewActivity = null;
    for (let i = 0; i < days.length; ++i) {
      const day = days[i];
      const [dayKey, items] = day;
      if (isToday(dayKey) || isInFuture(dayKey)) break;
      if (anyNewActivity(items)) {
        lastDayWithNewActivity = dayKey;
      }
    }
    return lastDayWithNewActivity;
  }
);

export class SmartDay extends React.Component {
  static propTypes = {
    day: string,
    // and other props to pass through to Day

    newActivityTargetDayKey: string,
    seekingNewActivity: bool,
    stickyOffset: number,
    animateScroll: func,
    updateTodo: func,
  }

  static defaultProps = {
    stickyOffset: 0,
    animateScroll: animateScroll,
  }

  componentDidMount() {
    const shouldScroll =
      this.rootElement &&
      this.props.seekingNewActivity &&
      this.props.newActivityTargetDayKey === this.props.day;
    if (shouldScroll) {
      this.props.animateScroll(this.rootElement, this.props.stickyOffset);
    }
  }

  rootElementRef = (elt) => { this.rootElement = elt; }

  render () {
    return <Day {...this.props} rootElementRef={this.rootElementRef} />;
  }
}

const mapStateToProps = (state) => ({
  newActivityTargetDayKey: getLastUnseenDayKeyWithNewActivity(state),
  seekingNewActivity: state.loading.seekingNewActivity,
});
const mapDispatchToProps = { updateTodo };
export default connect(mapStateToProps, mapDispatchToProps)(SmartDay);
