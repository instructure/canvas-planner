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
