import React, { Component } from 'react';
import themeable from 'instructure-ui/lib/themeable';
import classnames from 'classnames';
import containerQuery from 'instructure-ui/lib/util/containerQuery';
import Badge from 'instructure-ui/lib/components/Badge';
import PresentationContent from 'instructure-ui/lib/components/PresentationContent';
import { partition } from 'lodash';
import { arrayOf, string, object, bool } from 'prop-types';
import styles from './styles.css';
import theme from './theme.js';
import PlannerItem from '../PlannerItem';
import CompletedItemsFacade from '../CompletedItemsFacade';
import moment from 'moment-timezone';
import formatMessage from '../../format-message';
import { getBadgesForItem, getBadgesForItems } from '../../utilities/statusUtils';

class Grouping extends Component {
  static propTypes = {
    items: arrayOf(object).isRequired,
    title: string,
    color: string,
    image_url: string,
    timeZone: string.isRequired,
    url: string,
    isInPast: bool
  }

  static defaultProps = {
    isInPast: false
  }

  constructor (props) {
    super(props);
    this.state = {
      showCompletedItems: false,
      badgeMap: this.setupItemBadgeMap(props.items)
    };
  }

  setupItemBadgeMap (items) {
    const mapping = {};
    items.forEach((item) => {
      mapping[item.id] = getBadgesForItem(item);
    });
    return mapping;
  }

  handleFacadeClick = (e) => {
    if (e) { e.preventDefault(); }
    this.setState(() => ({
      showCompletedItems: true
    }), () => {
      this.groupingLink.focus();
    });
  }

  renderItemsAndFacade (items) {
    const [completedItems, otherItems ] = partition(items, item => item.completed);
    let itemsToRender = otherItems;
    if (this.state.showCompletedItems) {
      itemsToRender = items;
    }

    const componentsToRender = itemsToRender.map(item => (
      <li
        className={styles.item}
        key={item.id}
      >
        <PlannerItem
          theme={{
            iconColor: this.props.color
          }}
          color={this.props.color}
          completed={item.completed}
          id={item.id}
          courseName={this.props.title}
          date={moment(item.date).tz(this.props.timeZone)}
          associated_item={item.type}
          title={item.title}
          points={item.points}
          html_url={item.html_url}
          toggleCompletion={() => console.log('send me back to canvas')}
          badges={this.state.badgeMap[item.id]}
        />
      </li>
    ));

    if (!this.state.showCompletedItems && completedItems.length > 0) {
      // Super odd that this is keyed on length?  Sure it is.  But there should
      // only ever be one in our grouping and this keeps react from complaining
      componentsToRender.push(
        <li
          className={styles.item}
          key={completedItems.length}
        >
          <CompletedItemsFacade
            onClick={this.handleFacadeClick}
            itemCount={completedItems.length}
            badges={getBadgesForItems(completedItems)}
          />
        </li>
      );
    }

    return componentsToRender;
  }

  renderNotificationBadge () {
    if (this.props.isInPast && Object.keys(this.state.badgeMap).length) {

      const hasMissingBadge = badgeObj => badgeObj.id === 'missing';
      const hasItemWithMissingBadge = itemId => this.state.badgeMap[itemId].some(hasMissingBadge);
      const variant = Object.keys(this.state.badgeMap).some(hasItemWithMissingBadge) ? 'danger' : 'primary';

      return (
        <PresentationContent>
          <Badge standalone type="notification" variant={variant} />
        </PresentationContent>
      );
    } else {
      return null;
    }
  }

  render () {
    return (
      <div className={styles.root}>
        <div className={styles.activityIndicator}>
          {this.renderNotificationBadge()}
        </div>
        <a
          href={this.props.url || "#"}
          ref={(c) => { this.groupingLink = c; }}
          className={styles.hero}
          style={{backgroundImage: `url(${this.props.image_url || ''})`}}
        >
          <span className={classnames({
            [styles.overlay]: true,
            [styles.withImage]: this.props.image_url
          })}
            style={{ backgroundColor: this.props.color }}
          />
          <span className={styles.title}>
            {this.props.title || formatMessage('To Do')}
          </span>
        </a>
        <ol className={styles.items} style={{ borderColor: this.props.color }}>
          { this.renderItemsAndFacade(this.props.items)}
        </ol>
      </div>
    );
  }
}

export default themeable(theme, styles)(
  // we can update this to be whatever works for this component and its content
  containerQuery({
    'media-x-large': { minWidth: '68rem' },
    'media-large': { minWidth: '58rem' },
    'media-medium': { minWidth: '48rem' }
  })(Grouping)
);
