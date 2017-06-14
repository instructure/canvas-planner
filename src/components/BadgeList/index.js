import React, { Children, Component } from 'react';
import themeable from 'instructure-ui/lib/themeable';
import CustomPropTypes from 'instructure-ui/lib/util/CustomPropTypes';
import Pill from 'instructure-ui/lib/components/Pill';

import styles from './styles.css';
import theme from './theme.js';

class BadgeList extends Component {

  static propTypes = {
    children: CustomPropTypes.Children.oneOf([Pill])
  }

  renderChildren () {
    return Children.map(this.props.children, (child) => {
      return (
        <li className={styles.item}>
          {child}
        </li>
      );
    });
  }

  render () {
    return (
      <ul className={styles.root}>
        {this.renderChildren()}
      </ul>
    );
  }
}

export default themeable(theme, styles)(BadgeList);
