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
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Container from 'instructure-ui/lib/components/Container';
import Spinner from 'instructure-ui/lib/components/Spinner';
import Typography from 'instructure-ui/lib/components/Typography';
import formatMessage from '../../format-message';
import {animateSlideDown} from '../../utilities/scrollUtils';
import TV from './tv.svg';

export default class LoadingPastIndicator extends Component {
  static propTypes = {
    loadingPast: PropTypes.bool,            // actively loading?
    allPastItemsLoaded: PropTypes.bool      // there are no more?
  }
  static defaultProps = {
    loadingPast: false,
    allPastItemsLoaded: false
  }

  shouldComponentUpdate (nextProps, nextState) {
    return this.props.allPastItemsLoaded !== nextProps.allPastItemsLoaded ||
           this.props.loadingPast !== nextProps.loadingPast;
  }

  componentDidUpdate (prevProps) {
    // if we just transitioned from not loadingPast to loadingPast or
    // from not allPastItemsLoaded to allItemsLoaded, then run the transition
    // that slides the component in
    if((this.props.allPastItemsLoaded && this.props.allPastItemsLoaded !== prevProps.allPastItemsLoaded) ||
        (this.props.loadingPast && this.props.loadingPast !== prevProps.loadingPast)) {
      animateSlideDown(this.rootDiv);
    }
  }

  renderLoading () {
    if (this.props.loadingPast) {
      return (
        <Container as="div" padding="small" textAlign="center">
          <Container display="inline">
            <Spinner size="small" margin="0 x-small 0 0" title={formatMessage('Loading past items')}/>
          </Container>
          <Typography size="small" color="secondary">
            {formatMessage('Loading past items')}
          </Typography>
        </Container>
      );
    }
  }

  renderNoMore () {
    if (!this.props.loadingPast && this.props.allPastItemsLoaded) {
      return (
        <Container as="div" padding="small" textAlign="center">
          <Container display="block" margin="small">
            <TV role="img" aria-hidden="true" />
          </Container>
          <Typography size="large" as="div">
            {formatMessage('Beginning of Your To-Do History')}
          </Typography>
          <Typography size="medium" as="div">
            {formatMessage('You\'ve scrolled back to your very first To-Do!')}
          </Typography>
        </Container>
      );
    }
  }

  render () {
    return (
      <div ref={(elt) => { this.rootDiv = elt; }}>
        {this.renderLoading()}
        {this.renderNoMore()}
      </div>
    );
  }
}
