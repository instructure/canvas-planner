import React, { Component } from 'react';
import themeable from 'instructure-ui/lib/themeable';

import Opportunity from '../Opportunity';
import { array, string} from 'prop-types';
import formatMessage from '../../format-message';

import styles from './styles.css';
import theme from './theme.js';

export class Opportunities extends Component {
  static propTypes = {
    opportunities: array.isRequired,
    timeZone: string.isRequired,
    courses: array.isRequired
  }

  renderOpportunity = () => {
    return (
      this.props.opportunities.map(opportunity =>
          <li key={opportunity.id} className={styles.item}>
            <Opportunity
              dueAt={opportunity.due_at}
              points={opportunity.points_possible}
              courseName={this.props.courses.filter(( course ) => {
                return course.id === opportunity.course_id;
              })[0].shortName}
              opportunityTitle={opportunity.name}
              timeZone={this.props.timeZone}
              url={opportunity.html_url}
            />
          </li>
        )
    );
  }

  render () {
    return (
      <ol className={styles.root}>
        {this.props.opportunities.length ? this.renderOpportunity() : formatMessage('Nothing planned today')}
      </ol>
    );
  }
}

export default themeable(theme, styles)(Opportunities);
