import React, { Component } from 'react';
import themeable from 'instructure-ui/lib/themeable';
import containerQuery from 'instructure-ui/lib/util/containerQuery';
import Typography from 'instructure-ui/lib/components/Typography';
import Checkbox from 'instructure-ui/lib/components/Checkbox';
import Link from 'instructure-ui/lib/components/Link';
import ScreenReaderContent from 'instructure-ui/lib/components/ScreenReaderContent';
import Pill from 'instructure-ui/lib/components/Pill';
import Assignment from 'instructure-icons/lib/Line/IconAssignmentLine';
import Quiz from 'instructure-icons/lib/Line/IconQuizLine';
import Announcement from 'instructure-icons/lib/Line/IconAnnouncementLine';
import Discussion from 'instructure-icons/lib/Line/IconDiscussionLine';
import Note from 'instructure-icons/lib/Line/IconNoteLightLine';
import Calendar from 'instructure-icons/lib/Line/IconCalendarMonthLine';
import Page from 'instructure-icons/lib/Line/IconMsWordLine';
import BadgeList from '../BadgeList';
import styles from './styles.css';
import theme from './theme.js';
import { arrayOf, bool, number, string, func, shape } from 'prop-types';
import { momentObj } from 'react-moment-proptypes';
import formatMessage from '../../format-message';

class PlannerItem extends Component {
  static propTypes = {
    color: string,
    id: string.isRequired,
    title: string.isRequired,
    points: number,
    date: momentObj,
    courseName: string,
    completed: bool,
    associated_item: string,
    html_url: string,
    toggleCompletion: func.isRequired,
    badges: arrayOf(shape({
      text: string,
      variant: string
    }))
  };

  static defaultProps = {
    badges: []
  };

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


  renderDateField = () => {
    if (this.props.associated_item === "Announcement") {
      return this.props.date.format("LT");
    }
    return formatMessage(`DUE: {date}`, {date: this.props.date.format("LT")});
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
    if (this.props.badges.length) {
      return (
        <BadgeList>
          {this.props.badges.map((b) => (
            <Pill
              key={b.text}
              text={b.text}
              variant={b.variant}
            />
          ))}
        </BadgeList>
      );
    }
    return null;
  }

  renderItemMetrics = () => {
    return (
      <div className={styles.secondary}>
        <div className={styles.badges}>
          {this.renderBadges()}
        </div>
        <div className={styles.metrics}>
          {(this.props.points) ?
            <div className={styles.score}>
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
          <div className={styles.due}>
            <Typography color="secondary" size="x-small">
                { this.props.date
                    ? this.renderDateField()
                    : null
                }
            </Typography>
          </div>
        </div>
      </div>
    );
  }

  renderType = () => {
    if (!this.props.associated_item) {
      return formatMessage('{course} TO DO', { course: this.props.courseName || '' });
    } else {
      return `${this.props.courseName || ''} ${this.props.associated_item}`;
    }
  }

  renderItemDetails = () => {
    return (
      <div className={styles.details}>
        <div className={styles.type}>
          <Typography size="x-small" color="secondary">
            {this.renderType()}
          </Typography>
        </div>
        <div className={styles.title}>
          <Link href={this.props.html_url || "#" }>{this.props.title}</Link>
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
      <div className={styles.root}>
        <div className={styles.completed}>
          <Checkbox
            label={<ScreenReaderContent>{checkboxLabel}</ScreenReaderContent>}
            checked={this.state.completed}
            onChange={this.toggleCompletion}
          />
        </div>
        <div
          className={styles.icon}
          style={{ color: this.props.color }}
          aria-hidden="true"
        >
          {this.renderIcon()}
        </div>
        <div className={styles.layout}>
          {this.renderItemDetails()}
          {this.renderItemMetrics()}
        </div>
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
  })(PlannerItem)
);
