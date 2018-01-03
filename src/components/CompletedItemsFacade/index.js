/*
 * Copyright (C) 2017 - present Instructure, Inc.
 *
 * This file is part of Canvas.
 *
 * Canvas is free software: you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License as published by the Free
 * Software Foundation, version 3 of the License.
 *
 * Canvas is distributed in the hope that they will be useful, but WITHOUT ANY
 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
 * A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
 * details.
 *
 * You should have received a copy of the GNU Affero General Public License along
 * with this program. If not, see <http://www.gnu.org/licenses/>.
 */
import React, { Component } from 'react';
import themeable from '@instructure/ui-themeable/lib';
import containerQuery from '@instructure/ui-utils/lib/react/containerQuery';
import CheckboxFacade from '@instructure/ui-core/lib/components/Checkbox/CheckboxFacade';
import Pill from '@instructure/ui-core/lib/components/Pill';
import BadgeList from '../BadgeList';
import { func, number, string, arrayOf, shape } from 'prop-types';
import {animatable} from '../../dynamic-ui';

import styles from './styles.css';
import theme from './theme.js';

import formatMessage from '../../format-message';

export class CompletedItemsFacade extends Component {

  static propTypes = {
    onClick: func.isRequired,
    itemCount: number.isRequired,
    badges: arrayOf(shape({
      text: string,
      variant: string
    })),
    animatableIndex: number,
    animatableItemIds: arrayOf(string),
    registerAnimatable: func,
  }

  static defaultProps = {
    badges: [],
    registerAnimatable: () => {},
  }

  componentDidMount () {
    this.props.registerAnimatable('item', this, this.props.animatableIndex, this.props.animatableItemIds);
  }

  componentWillReceiveProps (newProps) {
    this.props.registerAnimatable('item', null, this.props.animatableIndex, this.props.animatableItemIds);
    this.props.registerAnimatable('item', this, newProps.animatableIndex, newProps.animatableItemIds);
  }

  componentWillUnmount () {
    this.props.registerAnimatable('item', null, this.props.animatableIndex, this.props.animatableItemIds);
  }

  getFocusable () { return this.mainButton; }

  renderBadges () {
    if (this.props.badges.length) {
      return (
        <BadgeList>
          {
            this.props.badges.map((b) => (
              <Pill
                key={b.text}
                text={b.text}
                variant={b.variant} />
            ))
          }
        </BadgeList>
      );
    }
    return null;
  }

  render () {
    return (
      <div className={styles.root}>
        <div className={styles.contentPrimary}>
          <button
            ref={elt => this.mainButton = elt}
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
          {this.renderBadges()}
        </div>
      </div>
    );
  }
}

export default animatable(themeable(theme, styles)(
  // we can update this to be whatever works for this component and its content
  containerQuery({
    'media-x-large': { minWidth: '68rem' },
    'media-large': { minWidth: '58rem' },
    'media-medium': { minWidth: '34rem' }
  })(CompletedItemsFacade)
));
