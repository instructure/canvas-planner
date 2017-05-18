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
import {bool, number, string, func} from 'prop-types';
import { momentObj } from 'react-moment-proptypes';
import formatMessage from '../../format-message';

class PlannerItem extends Component {
  static propTypes = {
    color: string,
    id: number.isRequired,
    title: string.isRequired,
    points: number,
    date: momentObj,
    courseName: string,
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
      <div>Pills</div>
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
                    ? formatMessage(`DUE: {date}`, {date: this.props.date.format("LT")})
                    : null
                }
            </Typography>
          </div>
        </div>
      </div>
    );
  }

  renderTitle = () => {
    if (!this.props.associated_item) {
      return formatMessage('{course} NOTE TO SELF', { course: this.props.courseName || '' });
    } else {
      return `${this.props.courseName || ''} ${this.props.associated_item}`;
    }
  }

  renderItemDetails = () => {
    return (
      <div className={styles.itemDetails}>
        <div className={styles.itemType}>
          <Typography size="x-small" color="secondary">
            {this.renderTitle()}
          </Typography>
        </div>
        <div className={styles.itemName}>
          <Link href="#">{this.props.title}</Link>
        </div>
      </div>
    );
  }


  render () {
    let assignmentType = this.props.associated_item ?
      this.props.associated_item : formatMessage('Task');
    let checkboxLabel = this.state.completed ?
      formatMessage('{assignmentType} {title} is complete',
        { assignmentType: assignmentType, title: this.props.title }) :
      formatMessage('{assignmentType} {title} is incomplete',
        { assignmentType: assignmentType, title: this.props.title });
    return (
      <li className={styles.item}>
        <div className={styles.itemCompleted}>
          <Checkbox
            label={<ScreenReaderContent>{checkboxLabel}</ScreenReaderContent>}
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
