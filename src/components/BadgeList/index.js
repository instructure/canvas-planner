import React, { Children, Component } from 'react';
import classnames from 'classnames';

import themeable from 'instructure-ui/lib/themeable';
import containerQuery from 'instructure-ui/lib/util/containerQuery';
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
    const classes = {
      [styles.root]: true
    };

    return (
      <ul className={classnames(classes)}>
        {this.renderChildren()}
      </ul>
    );
  }
}

export default themeable(theme, styles)(
  // we can update this to be whatever works for this component and its content
  containerQuery({
    'media-x-large': { minWidth: '68rem' },
    'media-large': { minWidth: '58rem' },
    'media-medium': { minWidth: '34rem' }
  })(BadgeList)
);
