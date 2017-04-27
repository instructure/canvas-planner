import React, { Component } from 'react';
import { connect } from 'react-redux';
import 'instructure-ui/lib/themes/canvas';
import Container from 'instructure-ui/lib/components/Container';
import Spinner from 'instructure-ui/lib/components/Spinner';
import { arrayOf, bool, object, string } from 'prop-types';
import Day from '../Day';
import formatMessage from '../../format-message';

export class PlannerApp extends Component {
  static propTypes = {
    dayKeys: arrayOf(string).isRequired,
    days: object, // This is okay being generic because each key is a date
    timeZone: string,
    isLoading: bool
  };

  static defaultProps = {
    isLoading: false
  };

  render () {
    return (
      <div className="PlannerApp">
        {
          this.props.isLoading ? (
            <Container
              display="block"
              padding="xxLarge medium"
              textAlign="center">
              <Spinner
                title={formatMessage('Loading planner items')}
                size="medium"
              />
            </Container>
          ) : (
            this.props.dayKeys.map((day) => {
              const dayData = this.props.days[day];
              return (
                <Day
                  timeZone={this.props.timeZone}
                  day={day}
                  itemsForDay={dayData}
                  key={day}
                />
              );
            })
          )
        }
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    days: state.days,
    dayKeys: Object.keys(state.days),
    isLoading: state.loading.isLoading
  };
};


export default connect(mapStateToProps)(PlannerApp);
