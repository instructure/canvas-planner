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
import scopeTab from 'instructure-ui/lib/util/dom/scopeTab';
import keycode from 'keycode';

import Opportunity from '../Opportunity';
import { findDOMNode } from 'react-dom';
import { array, string, func} from 'prop-types';
import formatMessage from '../../format-message';
// import ShowOnFocusButton from '../ShowOnFocusButton';
import Button from 'instructure-ui/lib/components/Button';
import IconXLine from 'instructure-icons/lib/Line/IconXLine';

import styles from './styles.css';
import theme from './theme.js';

export class Opportunities extends Component {
  static propTypes = {
    opportunities: array.isRequired,
    timeZone: string.isRequired,
    courses: array.isRequired,
    dismiss: func.isRequired,
    togglePopover: func.isRequired,
  }

  componentDidMount() {
    // eslint-disable-next-line react/no-find-dom-node
    setTimeout(() =>{
      let closeButtonRef = findDOMNode(this.closeButton);
      closeButtonRef.focus();
    }, 200);
  }

  handleKeyDown = (event) => {
    if ((event.keyCode === keycode.codes.tab)) {
      scopeTab(this._content, event);
    }

   if (event.keyCode === keycode.codes.escape) {
      event.preventDefault();
      this.props.togglePopover();
    }
  }

  renderOpportunity = () => {
    return (
      this.props.opportunities.map(opportunity =>
        <li key={opportunity.id} className={styles.item}>
          <Opportunity
            id={opportunity.id}
            dueAt={opportunity.due_at}
            points={opportunity.points_possible}
            courseName={this.props.courses.filter(( course ) => {
              return course.id === opportunity.course_id;
            })[0].shortName}
            opportunityTitle={opportunity.name}
            timeZone={this.props.timeZone}
            dismiss={this.props.dismiss}
            plannerOverride={opportunity.planner_override}
            url={opportunity.html_url}
          />
        </li>
      )
    );
  }

  render () {
    return (
      <div
        id="opportunities_parent"
        className={styles.root}
        onKeyDown={this.handleKeyDown}
        ref={(c) => {this._content=c;}}>
        <div className={styles.header}>
          <Button
            variant="icon"
            size="small"
            onClick={this.props.togglePopover}
            buttonRef={(btnRef) =>{this.closeButton = btnRef;}}>
            <IconXLine title={formatMessage('Close opportunities popover')} />
          </Button>
        </div>
        <ol className={styles.list}>
          {this.props.opportunities.length ? this.renderOpportunity() : formatMessage('Nothing new needs attention.')}
        </ol>
      </div>
    );
  }
}

export default themeable(theme, styles)(Opportunities);
