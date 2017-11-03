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
import Alert from 'instructure-ui/lib/components/Alert';

export default class ErrorAlert extends Component {
  static propTypes = {
    error: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Error)]),
    children: PropTypes.node.isRequired
  };

  static defaultProps = {
    error: null
  };

  renderDetail () {
    // don't want to show the raw error to the user, but it might come in handy.
    return this.props.error
      ? <span style={{display:'none'}}>{this.props.error.message || this.props.error.toString()}</span>
      : null;
  }

  render () {
    return (
      <Alert variant='error' margin="small">
        {this.props.children}
        {this.renderDetail()}
      </Alert>
    );
  }
}
