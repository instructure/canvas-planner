import React, { Component } from 'react';
import themeable from 'instructure-ui/lib/themeable';
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
    courseInfo: object.isRequired,
    timeZone: string.isRequired,
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
      <PlannerItem
        key={item.id}
        color={this.props.courseInfo.color}
        completed={item.completed}
        id={item.id}
        courseName={this.props.courseInfo.title}
        date={moment(item.date).tz(this.props.timeZone)}
        associated_item={item.type}
        title={item.title}
        points={item.points}
        html_url={item.html_url}
        toggleCompletion={() => console.log('send me back to canvas')}
        badges={this.state.badgeMap[item.id]}
      />
    ));

    if (!this.state.showCompletedItems && completedItems.length > 0) {
      // Super odd that this is keyed on length?  Sure it is.  But there should
      // only ever be one in our grouping and this keeps react from complaining
      componentsToRender.push(
        <CompletedItemsFacade
          key={completedItems.length}
          onClick={this.handleFacadeClick}
          itemCount={completedItems.length}
          badges={getBadgesForItems(completedItems)}
        />
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
      <ol className={styles.groupingList}>
        <li className={styles.grouping}>
          <div className={styles.activityIndicator}>
            {this.renderNotificationBadge()}
          </div>
          <a href={this.props.courseInfo.url || "#"}
            ref={(c) => { this.groupingLink = c; }}
            className={styles.groupingHero}
            style={{backgroundImage: `url(${this.props.courseInfo.image_url || ''})`}}
          >
            <span
              className={styles.groupingOverlay}
              style={{
                backgroundColor: this.props.courseInfo.color,
                opacity: (this.props.courseInfo.image_url) ? 0.75 : 1
              }}
            />
            <span
              className={styles.groupingName}
              style={{
                color: (this.props.courseInfo.color) ? this.props.courseInfo.color : null
              }}
            >
              {this.props.courseInfo.title || formatMessage('To Do')}
            </span>
          </a>
          <ol
            className={styles.itemList}
            style={{borderColor: this.props.courseInfo.color}}
          >
            { this.renderItemsAndFacade(this.props.items)}
          </ol>
        </li>
      </ol>
    );
  }
}

export default themeable(theme, styles)(
  // we can update this to be whatever works for this component and its content
  containerQuery({
    'media-medium': { minWidth: '48rem' }
  })(Grouping)
);
