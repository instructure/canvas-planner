import React, { Component } from 'react';
import { connect } from 'react-redux';
import Container from 'instructure-ui/lib/components/Container';
import Spinner from 'instructure-ui/lib/components/Spinner';
import { arrayOf, oneOfType, bool, object, string, number, func } from 'prop-types';
import { momentObj } from 'react-moment-proptypes';
import SmartDay from '../SmartDay';
import ShowOnFocusButton from '../ShowOnFocusButton';
import StickyButton from '../StickyButton';
import LoadingFutureIndicator from '../LoadingFutureIndicator';
import LoadingPastIndicator from '../LoadingPastIndicator';
import PlannerEmptyState from '../PlannerEmptyState';
import formatMessage from '../../format-message';
import {loadFutureItems, scrollIntoPast, loadPastUntilNewActivity, togglePlannerItemCompletion} from '../../actions';
import {getFirstLoadedMoment} from '../../utilities/dateUtils';
import {maintainViewportPosition} from '../../utilities/scrollUtils';

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
    loadPastUntilNewActivity: func,
    loadFutureItems: func,
    stickyOffset: number, // in pixels
    stickyZIndex: number,
    changeToDashboardCardView: func,
    togglePlannerItemCompletion: func,
  };

  static defaultProps = {
    isLoading: false,
    stickyOffset: 0,
  };


  takeFocusRef = (focusableElement) => {
    if (focusableElement) focusableElement.focus();
  }

  fixedElementRef = (elt) => {
    this.fixedElement = elt;
  }

  handleNewActivityClick = () => {
    this.props.loadPastUntilNewActivity();
  }

  handleLoadingPastIndicatorWillUnmount = () => {
    if (this.fixedElement) {
      maintainViewportPosition(this.fixedElement);
    }
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

    return (
      <StickyButton
        direction="up"
        onClick={this.handleNewActivityClick}
        offset={this.props.stickyOffset + 'px'}
        zIndex={this.props.stickyZIndex}
      >
        {formatMessage("New Activity")}
      </StickyButton>
    );
  }

  renderLoadingPast () {
    if (this.props.loadingPast) {
      return <LoadingPastIndicator
        onComponentWillUnmount={this.handleLoadingPastIndicatorWillUnmount} />;
    }
  }

  renderLoadMore () {
    if (this.props.isLoading) return;
    return <LoadingFutureIndicator
      loadingFuture={this.props.loadingFuture}
      allFutureItemsLoaded={this.props.allFutureItemsLoaded}
      onLoadMore={this.props.loadFutureItems} />;
  }

  renderNoAssignments() {
    return <PlannerEmptyState changeToDashboardCardView={this.props.changeToDashboardCardView}/>;
  }

  renderBody (children) {

    if (children.length === 0) {
      return <div>
        {this.renderNoAssignments()}
      </div>;
    }

    return <div className="PlannerApp">
      {this.renderNewActivity()}
      <ShowOnFocusButton
        buttonProps={{
          onClick: this.props.scrollIntoPast
        }}
      >
        {formatMessage('Load prior dates')}
      </ShowOnFocusButton>
      {this.renderLoadingPast()}
      {children}
      {this.renderLoadMore()}
      <div ref={this.fixedElementRef} />
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
      return <SmartDay
        stickyOffset={this.props.stickyOffset}
        takeFocusRef={takeFocusRef}
        timeZone={this.props.timeZone}
        day={dayKey}
        itemsForDay={dayItems}
        key={dayKey}
        toggleCompletion={this.props.togglePlannerItemCompletion}
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

const mapDispatchToProps = {loadFutureItems, scrollIntoPast, loadPastUntilNewActivity, togglePlannerItemCompletion};
export default connect(mapStateToProps, mapDispatchToProps)(PlannerApp);
