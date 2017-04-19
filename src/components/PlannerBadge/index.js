import React, { Component } from 'react';
import themeable from 'instructure-ui/lib/themeable';
import PropTypes from 'prop-types';

import styles from './styles.css'
import theme from './theme.js'

export class PlannerBadge extends Component {

  static propTypes = {
    children: PropTypes.node,
    count: PropTypes.number
  };

  render () {
    const {
      children,
      count
    } = this.props

    return (
      <span className={styles.root}>
        {count && (
          <span className={styles.count}>
            {count}
          </span>
        )}
        <span className={styles.children}>
          {children}
        </span>
      </span>
    )
  }
}

export default themeable(theme, styles)(PlannerBadge);
