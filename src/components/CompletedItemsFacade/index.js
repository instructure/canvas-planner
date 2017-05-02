import React, { Component } from 'react';
import themeable from 'instructure-ui/lib/themeable';
import CheckboxFacade from 'instructure-ui/lib/components/Checkbox/CheckboxFacade';
import { func, number } from 'prop-types';

import styles from './styles.css';
import theme from './theme.js';

import formatMessage from '../../format-message';

class CompletedItemsFacade extends Component {

  static propTypes = {
    onClick: func.isRequired,
    itemCount: number.isRequired
  }

  render () {
    return (
      <li className={styles.item}>
        <div className={styles.contentPrimary}>
          <button
            type="button"
            className={styles.button}
            onClick={this.props.onClick}
          >
            <span className={styles.buttonCheckbox} aria-hidden="true">
              <CheckboxFacade checked={true}>{''}</CheckboxFacade>
            </span>
            <span>
              {
                formatMessage(`{
                  count, plural,
                  one {Show # completed item}
                  other {Show # completed items}
                }`, { count: this.props.itemCount })
              }
            </span>
          </button>
        </div>
        <div className={styles.contentSecondary}>
          Pills
        </div>
      </li>
    );
  }
}

export default themeable(theme, styles)(CompletedItemsFacade);
