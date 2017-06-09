import React, { Component } from 'react';
import { connect } from 'react-redux';
import Button from 'instructure-ui/lib/components/Button';
import Container from 'instructure-ui/lib/components/Container';
import Spinner from 'instructure-ui/lib/components/Spinner';
import ScreenReaderContent from 'instructure-ui/lib/components/ScreenReaderContent';
import { arrayOf, oneOfType, bool, object, string, func } from 'prop-types';
import { momentObj } from 'react-moment-proptypes';
import Day from '../Day';
import LoadingFutureIndicator from '../LoadingFutureIndicator';
import LoadingPastIndicator from '../LoadingPastIndicator';
import formatMessage from '../../format-message';
import {loadFutureItems, scrollIntoPast} from '../../actions';
import {getFirstLoadedMoment} from '../../utilities/dateUtils';

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
    allPastItemsLoaded: bool,
    loadingFuture: bool,
    allFutureItemsLoaded: bool,
    setFocusAfterLoad: bool,
    firstNewDayKey: string,
    firstNewActivityDate: momentObj,
    scrollIntoPast: func,
    loadFutureItems: func,
  };

  static defaultProps = {
    isLoading: false
  };

  takeFocusRef = (focusableElement) => {
    if (focusableElement) focusableElement.focus();
  }

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

  renderNewActivity () {
    if (this.props.isLoading) return;
    if (!this.props.firstNewActivityDate) return;

    const firstLoadedMoment = getFirstLoadedMoment(this.props.days, this.props.timeZone);
    if (firstLoadedMoment.isSameOrBefore(this.props.firstNewActivityDate)) return;

    return <Button variant="primary" onClick={this.props.scrollIntoPast}>
      {formatMessage("New Activity")}
    </Button>;
  }

  renderLoadingPast () {
    if (this.props.loadingPast) return <LoadingPastIndicator />;
  }

  renderLoadMore () {
    if (this.props.isLoading) return;
    return <LoadingFutureIndicator
      loadingFuture={this.props.loadingFuture}
      allFutureItemsLoaded={this.props.allFutureItemsLoaded}
      onLoadMore={this.props.loadFutureItems} />;
  }

  renderBody (children) {
    return <div className="PlannerApp">
      {this.renderNewActivity()}
      <ScreenReaderContent>
        <Button onClick={this.props.scrollIntoPast}>
          {formatMessage('Load prior dates')}
        </Button>
      </ScreenReaderContent>
      {this.renderLoadingPast()}
      {children}
      {this.renderLoadMore()}
    </div>;
  }

  render () {
    if (this.props.isLoading) {
      return this.renderBody(this.renderLoading());
    }

    const children = this.props.days.map(([dayKey, dayItems]) => {
      let takeFocusRef;
      if (this.props.setFocusAfterLoad && this.props.firstNewDayKey === dayKey) {
        takeFocusRef = this.takeFocusRef;
      }
      return <Day
        takeFocusRef={takeFocusRef}
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
    allPastItemsLoaded: state.loading.allPastItemsLoaded,
    loadingFuture: state.loading.loadingFuture,
    allFutureItemsLoaded: state.loading.allFutureItemsLoaded,
    setFocusAfterLoad: state.loading.setFocusAfterLoad,
    firstNewDayKey: state.loading.firstNewDayKey,
    firstNewActivityDate: state.firstNewActivityDate,
    timeZone: state.timeZone,
  };
};

const mapDispatchToProps = {loadFutureItems, scrollIntoPast};
export default connect(mapStateToProps, mapDispatchToProps)(PlannerApp);
