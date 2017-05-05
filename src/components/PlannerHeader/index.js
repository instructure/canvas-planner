import React, { Component } from 'react';
import { connect } from 'react-redux';
import themeable from 'instructure-ui/lib/themeable';
import Button from 'instructure-ui/lib/components/Button';
import PlannerBadge from '../PlannerBadge';
import IconPlusLine from 'instructure-icons/react/Line/IconPlusLine';
import IconAlertLine from 'instructure-icons/react/Line/IconAlertLine';
import PropTypes from 'prop-types';
import UpdateItemTray from '../UpdateItemTray';
import Tray from 'instructure-ui/lib/components/Tray';

import styles from './styles.css';
import theme from './theme.js';
import formatMessage from '../../format-message';

export class PlannerHeader extends Component {

  static propTypes = {
    opportunityCount: PropTypes.number
  };

  static defaultProps = {
    opportunityCount: 4 // TODO: Remove this once real wiring up happens
  }

  constructor (props) {
    super(props);
    this.state = {
      trayOpen: false,
    };
  }

  toggleUpdateItemTray = () => {
    const trayOpen = this.state.trayOpen;
    this.setState({trayOpen: !trayOpen});
  }

  noteBtnOnClose = () => {
    this.addNoteBtn.focus();
  }

  opportunityTitle = () => {
    return (
      formatMessage(`{
        count, plural,
        =0 {# opportunities}
        one {# opportunity}
        other {# opportunities}
      }`, { count: this.props.opportunityCount })
    );
  }

  render () {
    return (
      <div className={styles.root}>
        <Button
          variant="icon"
          onClick={this.toggleUpdateItemTray}
          ref={(b) => { this.addNoteBtn = b; }}
        >
          <IconPlusLine title={formatMessage("Add Note to Self")} />
        </Button>
        <Button variant="icon">
          <PlannerBadge count={this.props.opportunityCount}>
            <IconAlertLine title={this.opportunityTitle()} />
          </PlannerBadge>
        </Button>
        <Tray
          closeButtonLabel={formatMessage("Close")}
          isOpen={this.state.trayOpen}
          label={formatMessage("Create/update planner item")}
          placement="right"
          trapFocus={true}
          onExited={this.noteBtnOnClose}
          onExiting={this.noteBtnOnClose}
          onRequestClose={this.toggleUpdateItemTray}
        >
          <UpdateItemTray />
        </Tray>
      </div>
    );
  }
}

export const ThemedPlannerHeader = themeable(theme, styles)(PlannerHeader);

const mapStateToProps = () => ({});

const mapDispatchToProps = () => ({});


export default connect(mapStateToProps, mapDispatchToProps)(ThemedPlannerHeader);
