import React, { Component } from 'react';
import themeable from 'instructure-ui/lib/themeable';
import Typography from 'instructure-ui/lib/components/Typography';
import Checkbox from 'instructure-ui/lib/components/Checkbox';
import Link from 'instructure-ui/lib/components/Link';
import ScreenReaderContent from 'instructure-ui/lib/components/ScreenReaderContent';
import Assignment from 'instructure-icons/react/Line/IconAssignmentLine';
import Quiz from 'instructure-icons/react/Line/IconQuizLine';
import Announcement from 'instructure-icons/react/Line/IconAnnouncementLine';
import Discussion from 'instructure-icons/react/Line/IconDiscussionLine';
import Note from 'instructure-icons/react/Line/IconNoteLightLine';
import Calendar from 'instructure-icons/react/Line/IconCalendarMonthLine';
import Page from 'instructure-icons/react/Line/IconMsWordLine';
import styles from './styles.css';
import theme from './theme.js';
import {bool, instanceOf, number, string, func} from 'prop-types';
import formatMessage from '../../format-message';

class PlannerItem extends Component {
  static propTypes = {
    color: string.isRequired,
    id: number.isRequired,
    title: string.isRequired,
    points: number,
    date: instanceOf(Date),
    completed: bool,
    associated_item: string,
    toggleCompletion: func.isRequired,
  }

  constructor (props) {
    super(props);
    this.state = {
      completed: props.completed,
    };
  }

  componentWillReceiveProps (nextProps) {
    this.setState({
      completed: nextProps.completed
    });
  }

  toggleCompletion = (e) => {
    this.props.toggleCompletion(this.props.id);
    this.setState({
      completed: !this.state.completed,
    });
  }

  renderIcon = () => {
    switch(this.props.associated_item) {
        case "Assignment":
          return <Assignment />;
        case "Quiz":
          return <Quiz />;
        case "Discussion":
          return <Discussion />;
        case "Announcement":
          return <Announcement />;
        case "Calendar Event":
          return <Calendar />;
        case "Page":
          return <Page />;
        default:
          return <Note />;

    }
  }

  renderBadges = () => {
    //We need to replace this with the badge
    //Component and configure how many badges to render
    return  (
      <div>Pills (sep. component?)</div>
    );
  }

  renderItemMetrics = () => {
    return (
      <div className={styles.itemSecondary}>
        {this.renderBadges()}
        <div className={styles.itemMetrics}>
          {(this.props.points) ?
            <div className={styles.itemScore}>
              <Typography color="secondary">
                <Typography size="large">{this.props.points}</Typography>
                <Typography size="x-small">&nbsp;
                  { this.props.points
                      ? formatMessage('pts')
                      : null
                  }
                </Typography>
              </Typography>
            </div> : null
          }
          <div className={styles.itemDue}>
            <Typography color="secondary" size="x-small">
                { this.props.date
                    ? formatMessage(`DUE: {date, time, short}`, {date: this.props.date})
                    : null
                }
            </Typography>
          </div>
        </div>
      </div>
    );
  }

  renderItemDetails = () => {
    return (
      <div className={styles.itemDetails}>
        <div className={styles.itemType}>
          <Typography size="x-small" color="secondary">
            {this.props.associated_item}
          </Typography>
        </div>
        <div className={styles.itemName}>
          <Link href="#">{this.props.title}</Link>
        </div>
      </div>
    );
  }


  render () {
    let checkBoxLabel = this.state.completed
      ? formatMessage('Task {title} is complete', { title: this.props.title })
      : formatMessage('Task {title} is incomplete', { title: this.props.title });
    return (
      <li className={styles.item}>
        <div className={styles.itemCompleted}>
          <Checkbox
            label={<ScreenReaderContent>{checkBoxLabel}</ScreenReaderContent>}
            checked={this.state.completed}
            onChange={this.toggleCompletion}
          />
        </div>
        <div className={styles.itemIcon} style={{color: this.props.color}} aria-hidden="true">
          {this.renderIcon()}
        </div>
        <div className={styles.itemLayout}>
          {this.renderItemDetails()}
          {this.renderItemMetrics()}
        </div>
      </li>
    );
  }
}

export default themeable(theme, styles)(PlannerItem);
