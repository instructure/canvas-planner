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
import themeable from 'instructure-ui/lib/themeable';
import classnames from 'classnames';
import containerQuery from 'instructure-ui/lib/util/containerQuery';
import Badge from 'instructure-ui/lib/components/Badge';
import ScreenReaderContent from 'instructure-ui/lib/components/ScreenReaderContent';
import { partition } from 'lodash';
import { arrayOf, string, number, object, func } from 'prop-types';
import styles from './styles.css';
import theme from './theme.js';
import PlannerItem from '../PlannerItem';
import CompletedItemsFacade from '../CompletedItemsFacade';
import moment from 'moment-timezone';
import formatMessage from '../../format-message';
import { getBadgesForItem, getBadgesForItems } from '../../utilities/statusUtils';
import { animatable } from '../../dynamic-ui';

export class Grouping extends Component {
  static propTypes = {
    items: arrayOf(object).isRequired,
    animatableIndex: number,
    title: string,
    color: string,
    image_url: string,
    timeZone: string.isRequired,
    url: string,
    toggleCompletion: func,
    updateTodo: func,
    registerAnimatable: func,
  }

  static defaultProps = {
    registerAnimatable: () => {},
  }

  constructor (props) {
    super(props);
    this.state = {
      showCompletedItems: false,
      badgeMap: this.setupItemBadgeMap(props.items)
    };
  }

  componentDidMount () {
    this.props.registerAnimatable('group', this, this.props.animatableIndex, this.itemUniqueIds());
  }

  componentWillReceiveProps (newProps) {
    this.props.registerAnimatable('group', null, this.props.animatableIndex, this.itemUniqueIds());
    this.props.registerAnimatable('group', this, newProps.animatableIndex, this.itemUniqueIds(newProps));
  }

  componentWillUnmount () {
    this.props.registerAnimatable('group', null, this.props.animatableIndex, this.itemUniqueIds());
  }

  itemUniqueIds (props = this.props) { return props.items.map(item => item.uniqueId); }

  setupItemBadgeMap (items) {
    const mapping = {};
    items.forEach((item) => {
      const badges = getBadgesForItem(item);
      if (badges.length) mapping[item.id] = badges;
    });
    return mapping;
  }

  groupingLinkRef = (link) => {
    this.groupingLink = link;
  }

  getFocusable () { return this.groupingLink; }
  getScrollable () { return this.groupingLink; }

  handleFacadeClick = (e) => {
    if (e) { e.preventDefault(); }
    this.setState(() => ({
      showCompletedItems: true
    }), () => {
      if (this.groupingLink) this.groupingLink.focus();
    });
  }

  renderItemsAndFacade (items) {
    const [completedItems, otherItems ] = partition(items, item => (item.completed && !item.show));
    let itemsToRender = otherItems;
    if (this.state.showCompletedItems) {
      itemsToRender = items;
    }
    const componentsToRender = itemsToRender.map((item, itemIndex) => (
      <li
        className={styles.item}
        key={item.uniqueId}
      >
        <PlannerItem
          theme={{
            iconColor: this.props.color
          }}
          color={this.props.color}
          completed={item.completed}
          id={item.id}
          uniqueId={item.uniqueId}
          animatableIndex={itemIndex}
          courseName={this.props.title}
          context={item.context || {}}
          date={moment(item.date).tz(this.props.timeZone)}
          associated_item={item.type}
          title={item.title}
          points={item.points}
          updateTodo={this.props.updateTodo}
          html_url={item.html_url}
          toggleCompletion={() => this.props.toggleCompletion(item)}
          badges={this.state.badgeMap[item.id]}
          details={item.details}
        />
      </li>
    ));

    if (!this.state.showCompletedItems && completedItems.length > 0) {
      // Super odd that this is keyed on length?  Sure it is.  But there should
      // only ever be one in our grouping and this keeps react from complaining
      const completedItemIds = completedItems.map(item => item.uniqueId);
      componentsToRender.push(
        <li
          className={styles.item}
          key={`length-${completedItems.length}`}
        >
          <CompletedItemsFacade
            onClick={this.handleFacadeClick}
            itemCount={completedItems.length}
            badges={getBadgesForItems(completedItems)}
            animatableIndex={itemsToRender.length}
            animatableItemIds={completedItemIds}
          />
        </li>
      );
    }

    return componentsToRender;
  }

  renderToDoText () {
    return formatMessage('To Do');
  }

  renderNotificationBadge () {
    let missing = false;
    const newItem = this.props.items.find(item => {
      if (item.status && item.status.missing) missing = true;
      return item.newActivity;
    });
    if (newItem || missing) {
      let badgeMessage = newItem ? formatMessage('New activity for ') : formatMessage('Missing items for ');
      badgeMessage += this.props.title ? this.props.title : this.renderToDoText();
      return (
        <div>
          <Badge standalone type="notification" variant={newItem ? 'primary' : 'danger'} />
          <ScreenReaderContent>
            {badgeMessage}
          </ScreenReaderContent>
        </div>
      );
    } else {
      return null;
    }
  }

  // I wouldn't have broken the background and title apart, but wrapping them in a container span breaks styling
  renderGroupLinkBackground() {
    return <span className={classnames({
      [styles.overlay]: true,
      [styles.withImage]: this.props.image_url
    })}
      style={{ backgroundColor: this.props.color }}
    />;
  }

  renderGroupLinkTitle() {
    return <span className={styles.title}>
        {this.props.title || this.renderToDoText()}
      </span>;
  }

  renderGroupLink () {
    if (!this.props.title) {
      return <span className={styles.hero}>
        {this.renderGroupLinkBackground()}
        {this.renderGroupLinkTitle()}
      </span>;
    }
    return <a
      href={this.props.url || "#"}
      ref={this.groupingLinkRef}
      className={`${styles.hero} ${styles.heroHover}`}
      style={{backgroundImage: `url(${this.props.image_url || ''})`}}
    >
      {this.renderGroupLinkBackground()}
      {this.renderGroupLinkTitle()}
    </a>;
  }

  render () {
    const badge = this.renderNotificationBadge();

    const activityIndicatorClasses = {
      [styles.activityIndicator]: true,
      [styles.hasBadge]: badge != null
    };

    return (
      <div className={styles.root}>
        <div
          className={classnames(activityIndicatorClasses)}
        >
          {badge}
        </div>
        {this.renderGroupLink()}
        <ol className={styles.items} style={{ borderColor: this.props.color }}>
          { this.renderItemsAndFacade(this.props.items)}
        </ol>
      </div>
    );
  }
}

export default animatable(themeable(theme, styles)(
  // we can update this to be whatever works for this component and its content
  containerQuery({
    'media-x-large': { minWidth: '68rem' },
    'media-large': { minWidth: '58rem' },
    'media-medium': { minWidth: '48rem' }
  })(Grouping)
));
