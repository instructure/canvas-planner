import React, { Component } from 'react';
import themeable from 'instructure-ui/lib/themeable';
import Heading from 'instructure-ui/lib/components/Heading';
import Typography from 'instructure-ui/lib/components/Typography';
import { string, arrayOf, object } from 'prop-types';
import styles from './styles.css';
import theme from './theme.js';
import { getFriendlyDate, getFullDate, isToday } from '../../utilities/dateUtils';
import { groupBy } from 'lodash';
import Grouping from '../Grouping';


class Day extends Component {
  static propTypes = {
    day: string.isRequired,
    itemsForDay: arrayOf(object),
    timeZone: string.isRequired
  }

  constructor (props) {
    super(props);

    this.friendlyName = getFriendlyDate(props.day);
    this.fullDate = getFullDate(props.day);
    this.state = {
      groupedItems: this.groupItems(props.itemsForDay)
    };
  }

  componentWillReceiveProps (nextProps) {
    this.setState((state) => {
      return {
        groupedItems: this.groupItems(nextProps.itemsForDay)
      };
    });
  }

  groupItems = (items) => groupBy(items, item => (item.context && item.context.id) || 'Notes');

  render () {
    return (
      <div className={styles.root}>
          <Heading>
            <Typography
              as="div"
              transform="uppercase"
              lineHeight="condensed"
              size={isToday(this.props.day) ? 'large' : 'medium'}
            >
              {this.friendlyName}
            </Typography>
            <Typography
              as="div"
              lineHeight="condensed"
            >
              {this.fullDate}
            </Typography>
          </Heading>

        <div className={styles.dayContent}>
          {
            Object.keys(this.state.groupedItems).map((cid) => {
              return (<Grouping
                courseInfo={this.state.groupedItems[cid][0].context || {}}
                timeZone={this.props.timeZone}
                items={this.state.groupedItems[cid]} key={cid} />);
            })
          }
        </div>
      </div>
    );
  }
}

export default themeable(theme, styles)(Day);
