import React, { Component } from 'react';
import themeable from 'instructure-ui/lib/themeable';
import { arrayOf, string, object } from 'prop-types';
import styles from './styles.css';
import theme from './theme.js';
import PlannerItem from '../PlannerItem';
import moment from 'moment-timezone';

class Grouping extends Component {
  static propTypes = {
    items: arrayOf(object).isRequired,
    courseInfo: object.isRequired,
    timeZone: string.isRequired
  }
  render () {
    return (
      <ol className={styles.groupingList}>
        <li
          className={styles.grouping}
          style={{borderColor: this.props.courseInfo.color}}>
          <a href="#"
            className={styles.groupingHero}
            style={{backgroundImage: `url(${this.props.courseInfo.image_url})`}}>
            <span
              className={styles.groupingOverlay}
              style={{backgroundColor: this.props.courseInfo.color}}></span>
            <span className={styles.groupingName}>
              {this.props.items[0].context.title}
            </span>
          </a>
          <ol
            className={styles.itemList}
            style={{borderColor: this.props.courseInfo.color}}>
            {
              this.props.items.map((item) => {
                return (
                  <PlannerItem
                    key={item.id}
                    color={item.context.color}
                    completed
                    id={item.id}
                    date={moment.tz(item.date, this.props.timeZone).toDate()}
                    associated_item={item.type}
                    title={item.title}
                    points={item.points}
                    toggleCompletion={() => console.log('send me back to canvas')}
                  />
                );
              })
            }
          </ol>
        </li>
      </ol>
    );
  }
}

export default themeable(theme, styles)(Grouping);
