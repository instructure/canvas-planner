import React, { Component } from 'react';
import _ from 'lodash';
import themeable from 'instructure-ui/lib/themeable';
import Container from 'instructure-ui/lib/components/Container';
import Button from 'instructure-ui/lib/components/Button';
import formatMessage from '../../format-message';
import PropTypes from 'prop-types';
import TextInput from 'instructure-ui/lib/components/TextInput';
import Select from 'instructure-ui/lib/components/Select';
import TextArea from 'instructure-ui/lib/components/TextArea';
import IconCalendarMonthSolid from 'instructure-icons/react/Solid/IconCalendarMonthSolid';
import Grid, {GridRow, GridCol} from 'instructure-ui/lib/components/Grid';

import styles from './styles.css';
import theme from './theme.js';

export class UpdateItemTray extends Component {
  static propTypes = {
    courses: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string,
      longName: PropTypes.string,
    })).isRequired,
    noteItem: PropTypes.object,
    onSavePlannerItem: PropTypes.func.isRequired,
    onDeletePlannerItem: PropTypes.func.isRequired,
  };

  constructor (props) {
    super(props);
    const updates = _.cloneDeep(props.noteItem) || {};
    if (updates.context) {
      updates.courseId = updates.context.id;
      delete updates.context;
    }
    this.state = {
      updates,
      titleMessages: [],
      dateMessages: [],
    };
  }

  handleSave = () => {
    const updates = Object.assign({}, this.state.updates);
    if (updates.courseId) {
      updates.context = { id: updates.courseId };
    }
    delete updates.courseId;
    this.props.onSavePlannerItem(updates);
  }

  handleChange = (field, value) => {
    this.setState({
      updates: {
        ...this.state.updates,
        [field]: value
      }
    });
  }

  handleCourseIdChange = (e) => {
    let value = e.target.value;
    if (value === 'none') value = undefined;
    this.handleChange('courseId', value);
  }

  handleTitleChange = (e) => {
    const value = e.target.value;
    if (value === '') {
      this.setState({
        titleMessages: [{type: 'error', text: formatMessage('title is required')}]
      });
    } else {
        this.setState({titleMessages: []});
    }
    this.handleChange('title', value);
  }

  handleDateChange = (e) => {
    const value = e.target.value;
    if (value === '') {
      this.setState({dateMessages: [{type: 'error', text: formatMessage('date is required')}]});
    } else {
      this.setState({dateMessages: []});
    }
    this.handleChange('date', value);
  }

  handleDeleteClick = () => {
    this.props.onDeletePlannerItem(this.props.noteItem);
  }

  findCurrentValue (field) {
    return this.state.updates[field] || '';
  }

  isValid () {
    // intentional empty string checking
    return this.state.updates.title && this.state.updates.date;
  }

  renderDeleteButton () {
    if (this.props.noteItem == null) return;
    return <Button
      variant="light"
      margin="0 x-small 0 0"
      onClick={this.handleDeleteClick}>
      {formatMessage("Delete")}
    </Button>;
  }

  renderSaveButton () {
    return <Button
      variant="primary"
      disabled={!this.isValid()}
      onClick={this.handleSave}>
        {formatMessage("Save")}
    </Button>;
  }

  renderTitleInput () {
    const value = this.findCurrentValue('title');
    return (
      <TextInput
        label={formatMessage("Title")}
        value={value}
        messages={this.state.titleMessages}
        onChange={this.handleTitleChange}
      />
    );
  }

  renderDateInput () {
    const value = this.findCurrentValue('date');
    return (
      <TextInput
        label={formatMessage("Date")}
        value={value}
        messages={this.state.dateMessages}
        onChange={this.handleDateChange}
      />
    );
  }

  renderCourseSelectOptions () {
    if (!this.props.courses) return [];
    return this.props.courses.map(course => {
      return <option key={course.id} value={course.id}>{course.longName}</option>;
    });
  }

  renderCourseSelect () {
    let courseId = this.findCurrentValue('courseId');
    if (courseId == null) courseId = 'none';
    return (
      <Select
        label={formatMessage("Course")}
        value={courseId}
        onChange={this.handleCourseIdChange}
      >
        <option value="none">{formatMessage("Optional: Add Course")}</option>
        {this.renderCourseSelectOptions()}
      </Select>
    );
  }

  renderDetailsInput () {
    const value = this.findCurrentValue('details');
    return (
      <TextArea
        label={formatMessage("Details")}
        height="12rem"
        autoGrow={false}
        value={value}
        onChange={(e) => this.handleChange('details', e.target.value)}
      />
    );
  }

  render () {
    return (
      <div className={styles.root}>
        <Container
          display="block"
          as="section"
          margin="large medium"
          textAlign="end"
        >
          <Container
            display="block"
            margin="medium 0"
          >
            {this.renderTitleInput()}
          </Container>
          <Grid vAlign="bottom" colSpacing="none">
            <GridRow>
              <GridCol>
                {this.renderDateInput()}
              </GridCol>
              <GridCol>
                <Button variant="icon">
                  <IconCalendarMonthSolid />
                </Button>
              </GridCol>
            </GridRow>
          </Grid>
          <Container
            display="block"
            margin="medium 0"
          >
            {this.renderCourseSelect()}
          </Container>
          <Container
            display="block"
            margin="medium 0"
          >
            {this.renderDetailsInput()}
          </Container>
          {this.renderDeleteButton()}
          {this.renderSaveButton()}
        </Container>
      </div>
    );
  }
}

export default themeable(theme, styles)(UpdateItemTray);
