import React, { Component } from 'react';
import { connect } from 'react-redux';
import themeable from 'instructure-ui/lib/themeable';
import Button from 'instructure-ui/lib/components/Button';
import PlannerBadge from '../PlannerBadge';
import IconPlusLine from 'instructure-icons/react/Line/IconPlusLine';
import IconAlertLine from 'instructure-icons/react/Line/IconAlertLine';
import PropTypes from 'prop-types';

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

  render () {
    return (
      <div className={styles.root}>
        <Button variant="icon">
          <IconPlusLine title={formatMessage("Add Note to Self")} />
        </Button>
        <Button variant="icon">
          <PlannerBadge count={this.props.opportunityCount}>
            <IconAlertLine title={formatMessage("Opportunities")} />
          </PlannerBadge>
        </Button>
      </div>
    );
  }
}

export const ThemedPlannerHeader = themeable(theme, styles)(PlannerHeader);

const mapStateToProps = () => ({});

const mapDispatchToProps = () => ({});


export default connect(mapStateToProps, mapDispatchToProps)(ThemedPlannerHeader);
