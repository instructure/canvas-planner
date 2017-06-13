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
    changeToDashboardCardView: func.isRequired
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
