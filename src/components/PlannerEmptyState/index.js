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
import themeable from 'instructure-ui/lib/themeable';
import { func } from 'prop-types';

import Heading from 'instructure-ui/lib/components/Heading';
import Link from 'instructure-ui/lib/components/Link';

import formatMessage from '../../format-message';
import DesertSvg from './empty-desert.svg'; // Currently uses react-svg-loader

import styles from './styles.css';
import theme from './theme.js';

class PlannerEmptyState extends Component {

  static propTypes = {
    changeToDashboardCardView: func
  }

  handleDashboardCardLinkClick = () => {
    if (this.props.changeToDashboardCardView) {
        this.props.changeToDashboardCardView();
    }
  }

  render () {
    return (
      <div className={styles.root}>
        <DesertSvg className={styles.desert}/>
        <div className={styles.title}>
          <Heading>{formatMessage("No Due Dates Assigned")}</Heading>
        </div>
        <div className={styles.subtitlebox}>
          <div className={styles.subtitle}>{formatMessage("Looks like there isn't anything here")}</div>
          <Link onClick={this.handleDashboardCardLinkClick}>{formatMessage("Go to Dashboard Card View")}</Link>
        </div>
      </div>
    );
  }
}

export default themeable(theme, styles)(PlannerEmptyState);
