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
import classnames from 'classnames';
import themeable from 'instructure-ui/lib/themeable';
import { bool, func, node, number, string, oneOf } from 'prop-types';
import IconArrowUpSolid from 'instructure-icons/lib/Solid/IconArrowUpSolid';
import IconArrowDownLine from 'instructure-icons/lib/Line/IconArrowDownLine';

import styles from './styles.css';
import theme from './theme.js';

class StickyButton extends Component {
  static propTypes = {
    children: node.isRequired,
    onClick: func,
    disabled: bool,
    direction: oneOf(['none', 'up', 'down']),
    zIndex: number,
    offset: string,
  };

  static defaultProps = {
    direction: 'none',
    offset: '0',
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
      return <IconArrowUpSolid className={styles.icon} />;
    } else if (direction === 'down') {
      return <IconArrowDownLine className={styles.icon} />;
    } else {
      return null;
    }
  }

  render () {
    const {
      children,
      disabled,
      direction,
      zIndex,
      offset,
    } = this.props;

    const classes = {
      [styles.root]: true,
      [styles['direction--' + direction]]: direction !== 'none'
    };

    const style = {
      zIndex: (zIndex) ? zIndex : null,
      top: '0',
    };

    if ( window.CSS &&
      (window.CSS.supports('position', 'sticky') || window.CSS.supports('position', '-webkit-sticky')) ) {
      style.top = offset;
    }

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
