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

export default class LoadingPastIndicator extends Component {
  static propTypes = {
    onComponentWillUnmount: PropTypes.func,
  }

  componentDidMount () {
    if (this.rootDiv) animateSlideDown(this.rootDiv);
  }

  componentWillUnmount () {
    if (this.props.onComponentWillUnmount) this.props.onComponentWillUnmount();
  }

  rootDiv = (elt) => {
    this.rootDiv = elt;
  }

  render () {
    return <div ref={this.rootDiv}>
      <Container as="div" padding="small" textAlign="center">
        <Container display="inline">
          <Spinner size="small" margin="0 x-small 0 0" title={formatMessage('Loading past items')}/>
        </Container>
        <Typography size="small" color="secondary">
          {formatMessage('Loading past items')}
        </Typography>
      </Container>
    </div>;
  }
}
