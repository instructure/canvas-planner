import React, { Component } from 'react';
import themeable from 'instructure-ui/lib/themeable';
import PropTypes from 'prop-types';
import PresentationContent from 'instructure-ui/lib/components/PresentationContent';

import styles from './styles.css';
import theme from './theme.js';

export class PlannerBadge extends Component {

  static propTypes = {
    children: PropTypes.node,
    count: PropTypes.number,
  };

  render () {
    const {
      children,
      count
    } = this.props;
    let countIcon = null;
    if (count && count > 0) {
      countIcon = (
        <span className={styles.count}>
          <PresentationContent>{count}</PresentationContent>
        </span>
      );
    }
    return (
      <span className={styles.root}>
        {countIcon}
        <span className={styles.children}>
          {children}
        </span>
      </span>
    );
  }
}

export default themeable(theme, styles)(PlannerBadge);
