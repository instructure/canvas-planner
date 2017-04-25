import React, { Component } from 'react';
import 'instructure-ui/lib/themes/canvas';
import PlannerItem from '../PlannerItem';
import { connect } from 'react-redux';
import 'instructure-ui/lib/themes/canvas';
import formatMessage from '../../format-message';
import { arrayOf, string } from 'prop-types';

export class PlannerApp extends Component {
  static propTypes = {
    dayKeys: arrayOf(string).isRequired
  };

  render () {
    return (
      <div className="PlannerApp">
        {
          this.props.dayKeys.map((day) => {
            return (
              <div key={day}>{formatMessage(`This is a placeholder for {day}`, { day })}</div>
            );
          })
        }
        <ol style={{listStyleType: 'none', margin: 0, padding: 0}}>
          <PlannerItem
            color="#d71f85"
            completed
            id={5}
            associated_item='Quiz'
            title='This is an assignment'
            points={25}
            toggleCompletion={() => console.log('send me back to canvas')}
          />
        </ol>
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
