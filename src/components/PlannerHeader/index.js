import React, { Component } from 'react';
import { connect } from 'react-redux';
import themeable from 'instructure-ui/lib/themeable';
import Button from 'instructure-ui/lib/components/Button';
import IconPlusLine from 'instructure-icons/lib/Line/IconPlusLine';
import IconAlertLine from 'instructure-icons/lib/Line/IconAlertLine';
import Popover, {PopoverTrigger, PopoverContent} from 'instructure-ui/lib/components/Popover';
import PropTypes from 'prop-types';
import UpdateItemTray from '../UpdateItemTray';
import Tray from 'instructure-ui/lib/components/Tray';
import Badge from 'instructure-ui/lib/components/Badge';
import Opportunities from '../Opportunities';
import {addDay, savePlannerItem, deletePlannerItem, getOpportunities} from '../../actions';

import styles from './styles.css';
import theme from './theme.js';
import formatMessage from '../../format-message';
export class PlannerHeader extends Component {

  static propTypes = {
    courses: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string,
      longName: PropTypes.string,
    })).isRequired,
    addDay: PropTypes.func,
    savePlannerItem: PropTypes.func.isRequired,
    deletePlannerItem: PropTypes.func.isRequired,
    locale: PropTypes.string.isRequired,
    timeZone: PropTypes.string.isRequired,
    opportunities: PropTypes.array.isRequired,
    getOpportunities: PropTypes.func.isRequired,
  };

  constructor (props) {
    super(props);
    this.state = {
      trayOpen: false,
    };
  }

  componentDidMount() {
    this.props.getOpportunities();
  }

  handleSavePlannerItem = (plannerItem) => {
    this.toggleUpdateItemTray();
    this.props.savePlannerItem(plannerItem);
  }

  handleDeletePlannerItem = (plannerItem) => {
    this.toggleUpdateItemTray();
    this.props.deletePlannerItem(plannerItem);
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
      }`, { count: this.props.opportunities.length})
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
          <IconPlusLine title={formatMessage("Add To Do")} />
        </Button>
        <Popover on="click">
          <PopoverTrigger>
            <Button variant="icon">
              <Badge {...this.props.opportunities.length ? {count :this.props.opportunities.length} : {}}>
                <IconAlertLine title={this.opportunityTitle()} />
              </Badge>
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <Opportunities
              opportunities={this.props.opportunities}
              courses={this.props.courses}
              timeZone={this.props.timeZone} />
          </PopoverContent>
        </Popover>
        <Tray
          closeButtonLabel={formatMessage("Close")}
          isOpen={this.state.trayOpen}
          label={formatMessage("Create/update planner item")}
          placement="end"
          trapFocus={true}
          onExited={this.noteBtnOnClose}
          onExiting={this.noteBtnOnClose}
          onRequestClose={this.toggleUpdateItemTray}
        >
          <UpdateItemTray
            locale={this.props.locale}
            timeZone={this.props.timeZone}
            onSavePlannerItem={this.handleSavePlannerItem}
            onDeletePlannerItem={this.handleDeletePlannerItem}
            courses={this.props.courses}
          />
        </Tray>
      </div>
    );
  }
}

export const ThemedPlannerHeader = themeable(theme, styles)(PlannerHeader);

const mapStateToProps = ({opportunities, loading, courses}) => ({opportunities, loading, courses});
const mapDispatchToProps = {addDay, savePlannerItem, deletePlannerItem, getOpportunities};

export default connect(mapStateToProps, mapDispatchToProps)(ThemedPlannerHeader);
