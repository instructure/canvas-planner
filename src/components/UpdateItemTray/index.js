import React, { Component } from 'react';
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
    noteItem: PropTypes.object,
  };

  constructor (props) {
    super(props);
    this.state = {
      updates: {
        ...props.noteItem
      }
    };
  }

  handleSave () {
    // TODO: make save work
    return true;
  }

  handleChange (field, value) {
    this.setState({
      updates: {
        ...this.state.updates,
        [field]: value
      }
    });
  }

  findCurrentValue (field) {
    return this.state.updates[field] || '';
  }

  renderDeleteButton () {
    const button = <Button variant="light" margin="0 xSmall 0 0">{formatMessage("Delete")}</Button>;
    return this.props.noteItem ? button : null;
  }

  renderTitleInput () {
    const value = this.findCurrentValue('title');
    return (
      <TextInput
        label={formatMessage("Title")}
        value={value}
        required={true}
        onChange={(e) => this.handleChange('title', e.target.value)}
      />
    );
  }

  renderDateInput () {
    const value = this.findCurrentValue('date');
    return (
      <TextInput
        label={formatMessage("Date")}
        value={value}
        onChange={(e) => this.handleChange('date', e.target.value)}
      />
    );
  }

  renderCourseSelect () {
    const value = this.findCurrentValue('courseId');
    // TODO: get list of courses to select from
    return (
      <Select
        label={formatMessage("Course")}
        defaultValue="0"
        onChange={(e) => this.handleChange('courseId', e.target.value)}>
        <option value="0">{formatMessage("Optional: Add Course")}</option>
        <option value="1">{value}</option>
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
        <Container as="section" margin="large medium" textAlign="right">
          <Container margin="medium 0">
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
          <Container margin="medium 0">
            {this.renderCourseSelect()}
          </Container>
          <Container margin="medium 0">
            {this.renderDetailsInput()}
          </Container>
          {this.renderDeleteButton()}
          <Button variant="primary" onClick={this.handleSave}>{formatMessage("Save")}</Button>
        </Container>
      </div>
    );
  }
}

export default themeable(theme, styles)(UpdateItemTray);
