import React, { Component } from 'react';
import 'instructure-ui/lib/themes/canvas';
import { connect } from 'react-redux';
import 'instructure-ui/lib/themes/canvas';
import { arrayOf, object, string } from 'prop-types';
import Day from '../Day';

export class PlannerApp extends Component {
  static propTypes = {
    dayKeys: arrayOf(string).isRequired,
    days: object, // This is okay being generic because each key is a date
    timeZone: string
  };

  render () {
    return (
      <div className="PlannerApp">
        {
          this.props.dayKeys.map((day) => {
            const dayData = this.props.days[day];
            return (
              <Day timeZone={this.props.timeZone} day={day} itemsForDay={dayData} key={day} />
            );
          })
        }
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    days: state.days,
    dayKeys: Object.keys(state.days)
  };
};


export default connect(mapStateToProps)(PlannerApp);
