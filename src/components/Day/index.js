import React, { Component } from 'react';
import moment from 'moment';
import themeable from 'instructure-ui/lib/themeable';
import Heading from 'instructure-ui/lib/components/Heading';
import Typography from 'instructure-ui/lib/components/Typography';
import Container from 'instructure-ui/lib/components/Container';
import { string, arrayOf, object } from 'prop-types';
import styles from './styles.css';
import theme from './theme.js';
import { getFriendlyDate, getFullDate, isToday } from '../../utilities/dateUtils';
import { groupBy } from 'lodash';
import Grouping from '../Grouping';
import formatMessage from '../../format-message';


class Day extends Component {
  static propTypes = {
    day: string.isRequired,
    itemsForDay: arrayOf(object),
    timeZone: string.isRequired
  }

  constructor (props) {
    super(props);

    const tzMomentizedDate = moment.tz(props.day, props.timeZone);
    this.friendlyName = getFriendlyDate(tzMomentizedDate);
    this.fullDate = getFullDate(tzMomentizedDate);
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
    const hasGroupedItems = !!Object.keys(this.state.groupedItems).length;
    return (
      <div className={styles.root}>
          <Heading
            border={(hasGroupedItems) ? null : 'bottom'}>
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
            (hasGroupedItems) ? (
              Object.keys(this.state.groupedItems).map((cid) => {
                return (
                  <Grouping
                    courseInfo={this.state.groupedItems[cid][0].context || {}}
                    timeZone={this.props.timeZone}
                    items={this.state.groupedItems[cid]} key={cid}
                  />
                );
              })
            ) : (
              <Container textAlign="center" margin="small 0 0 0">
                <Typography>{formatMessage('Nothing planned today')}</Typography>
              </Container>
            )
          }
        </div>
      </div>
    );
  }
}

export default themeable(theme, styles)(Day);
