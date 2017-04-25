import React, { Component } from 'react';
import themeable from 'instructure-ui/lib/themeable';
import Heading from 'instructure-ui/lib/components/Heading';
import Typography from 'instructure-ui/lib/components/Typography';
// import moment from 'moment';
import { string, arrayOf, object } from 'prop-types';
import styles from './styles.css';
import theme from './theme.js';
import { getFriendlyDate, getFullDate, isToday } from '../../utilities/dateUtils';
import { groupBy } from 'lodash';


class Day extends Component {
  static propTypes = {
    day: string.isRequired,
    itemsForDay: arrayOf(object)
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
              return (<div key={cid}>Grouping Placeholder for course id:{cid}</div>);
            })
          }
        </div>
      </div>
    );
  }
}

export default themeable(theme, styles)(Day);
