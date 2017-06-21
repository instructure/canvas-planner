import React, { Component } from 'react';
import moment from 'moment-timezone';
import themeable from 'instructure-ui/lib/themeable';
import Heading from 'instructure-ui/lib/components/Heading';
import Typography from 'instructure-ui/lib/components/Typography';
import Container from 'instructure-ui/lib/components/Container';
import { string, arrayOf, object, func } from 'prop-types';
import styles from './styles.css';
import theme from './theme.js';
import { getFriendlyDate, getFullDate, isToday, isInPast } from '../../utilities/dateUtils';
import { groupBy } from 'lodash';
import Grouping from '../Grouping';
import formatMessage from '../../format-message';


class Day extends Component {
  static propTypes = {
    day: string.isRequired,
    itemsForDay: arrayOf(object),
    timeZone: string.isRequired,
    takeFocusRef: func,
    rootElementRef: func,
    toggleCompletion: func,
  }

  constructor (props) {
    super(props);

    const tzMomentizedDate = moment.tz(props.day, props.timeZone);
    this.friendlyName = getFriendlyDate(tzMomentizedDate);
    this.fullDate = getFullDate(tzMomentizedDate);
    this.isInPast = isInPast(tzMomentizedDate);
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
      <div className={styles.root} ref={this.props.rootElementRef}>
          <Heading
            border={(hasGroupedItems) ? 'none' : 'bottom'}
          >
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

        <div>
          {
            (hasGroupedItems) ? (
              Object.keys(this.state.groupedItems).map((cid, index) => {
                const courseInfo = this.state.groupedItems[cid][0].context || {};
                let takeFocusRef;
                if (index === 0) takeFocusRef = this.props.takeFocusRef;
                return (
                  <Grouping
                    takeFocusRef={takeFocusRef}
                    isInPast={this.isInPast}
                    title={courseInfo.title}
                    image_url={courseInfo.image_url}
                    color={courseInfo.color}
                    timeZone={this.props.timeZone}
                    items={this.state.groupedItems[cid]}
                    url={courseInfo.url}
                    key={cid}
                    theme={{
                      titleColor: courseInfo.color || '#008EE2'
                    }}
                    toggleCompletion={this.props.toggleCompletion}
                  />
                );
              })
            ) : (
              <Container
                textAlign="center"
                display="block"
                margin="small 0 0 0"
              >
                {formatMessage('Nothing planned today')}
              </Container>
            )
          }
        </div>
      </div>
    );
  }
}

export default themeable(theme, styles)(Day);
