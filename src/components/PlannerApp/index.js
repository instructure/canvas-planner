import React, { Component } from 'react';
import { connect } from 'react-redux';
import Container from 'instructure-ui/lib/components/Container';
import Spinner from 'instructure-ui/lib/components/Spinner';
import { arrayOf, oneOfType, bool, object, string } from 'prop-types';
import Day from '../Day';
import formatMessage from '../../format-message';

export class PlannerApp extends Component {
  static propTypes = {
    days: arrayOf(
      arrayOf(
        oneOfType([/* date */ string, arrayOf(/* items */ object)])
      )
    ),
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
              padding="xx-large medium"
              textAlign="center"
            >
              <Spinner
                title={formatMessage('Loading planner items')}
                size="medium"
              />
            </Container>
          ) : (
            this.props.days.map(([dayKey, dayItems]) => {
              return (
                <Day
                  timeZone={this.props.timeZone}
                  day={dayKey}
                  itemsForDay={dayItems}
                  key={dayKey}
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
    isLoading: state.loading.isLoading,
    timeZone: state.timeZone,
  };
};


export default connect(mapStateToProps)(PlannerApp);
