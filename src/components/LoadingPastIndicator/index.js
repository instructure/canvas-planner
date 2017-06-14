import React, { Component } from 'react';
import themeable from 'instructure-ui/lib/themeable';
import Spinner from 'instructure-ui/lib/components/Spinner';
import formatMessage from 'format-message';

import styles from './styles.css';
import theme from './theme.js';

class LoadingPastIndicator extends Component {
  render () {
    return (
      <span className={styles.root}>
        <Spinner size="small" title={formatMessage('Loading past items')}/>
        <span className={styles.message}>
          {formatMessage('Loading past items')}
        </span>
      </span>
    );
  }
}

export default themeable(theme, styles)(LoadingPastIndicator);
