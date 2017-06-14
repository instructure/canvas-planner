import React, { Component } from 'react';
import classnames from 'classnames';
import themeable from 'instructure-ui/lib/themeable';
import { bool, func, node, number, oneOf } from 'prop-types';
import IconMoveUpLine from 'instructure-icons/lib/Line/IconMoveUpLine';
import IconMoveDownLine from 'instructure-icons/lib/Line/IconMoveDownLine';

import styles from './styles.css';
import theme from './theme.js';

class StickyButton extends Component {
  static propTypes = {
    children: node.isRequired,
    onClick: func,
    disabled: bool,
    direction: oneOf(['none', 'up', 'down']),
    zIndex: number
  };

  static defaultProps = {
    direction: 'none'
  };

  handleClick = (e) => {
    const {
      disabled,
      onClick
    } = this.props;

    if (disabled) {
      e.preventDefault();
      e.stopPropagation();
    } else if (typeof onClick === 'function') {
      onClick(e);
    }
  };

  renderIcon () {
    const direction = this.props.direction;

    if (direction === 'up') {
      return <IconMoveUpLine className={styles.icon} />;
    } else if (direction === 'down') {
      return <IconMoveDownLine className={styles.icon} />;
    } else {
      return null;
    }
  }

  render () {
    const {
      children,
      disabled,
      direction,
      zIndex
    } = this.props;

    const classes = {
      [styles.root]: true,
      [styles['direction--' + direction]]: direction !== 'none'
    };

    const style = {
      zIndex: (zIndex) ? zIndex : null
    };

    return (
      <button
        type="button"
        onClick={this.handleClick}
        className={classnames(classes)}
        style={style}
        aria-disabled={(disabled) ? 'true' : null}
      >
        <span className={styles.layout}>
          {children}
          {this.renderIcon()}
        </span>
      </button>
    );
  }
}

export default themeable(theme, styles)(StickyButton);
