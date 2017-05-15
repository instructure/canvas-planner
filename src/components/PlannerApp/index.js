import React, { Component } from 'react';
import { connect } from 'react-redux';
import Button from 'instructure-ui/lib/components/Button';
import Container from 'instructure-ui/lib/components/Container';
import Spinner from 'instructure-ui/lib/components/Spinner';
import ScreenReaderContent from 'instructure-ui/lib/components/ScreenReaderContent';
import { arrayOf, oneOfType, bool, object, string, func } from 'prop-types';
import Day from '../Day';
import LoadingPastIndicator from '../LoadingPastIndicator';
import formatMessage from '../../format-message';
import {scrollIntoPast} from '../../actions';

export class PlannerApp extends Component {
  static propTypes = {
    days: arrayOf(
      arrayOf(
        oneOfType([/* date */ string, arrayOf(/* items */ object)])
      )
    ),
    timeZone: string,
    isLoading: bool,
    loadingPast: bool,
    scrollIntoPast: func,
  };

  static defaultProps = {
    isLoading: false
  };

  renderLoading () {
    return <Container
      display="block"
      padding="xx-large medium"
      textAlign="center"
    >
      <Spinner
        title={formatMessage('Loading planner items')}
        size="medium"
      />
    </Container>;
  }

  renderLoadingPast () {
    if (this.props.loadingPast) return <LoadingPastIndicator />;
  }

  renderBody (children) {
    return <div className="PlannerApp">
      <ScreenReaderContent>
        <Button onClick={this.props.scrollIntoPast}>
          {formatMessage('Load prior dates')}
        </Button>
      </ScreenReaderContent>
      {this.renderLoadingPast()}
      {children}
    </div>;
  }

  render () {
    if (this.props.isLoading) {
      return this.renderBody(this.renderLoading());
    }

    const children = this.props.days.map(([dayKey, dayItems]) => {
      return <Day
        timeZone={this.props.timeZone}
        day={dayKey}
        itemsForDay={dayItems}
        key={dayKey}
      />;
    });

    return this.renderBody(children);
  }
}

const mapStateToProps = (state) => {
  return {
    days: state.days,
    isLoading: state.loading.isLoading,
    loadingPast: state.loading.loadingPast,
    timeZone: state.timeZone,
  };
};

const mapDispatchToProps = {scrollIntoPast};
export default connect(mapStateToProps, mapDispatchToProps)(PlannerApp);
