import React, { Component } from 'react';
import themeable from 'instructure-ui/lib/themeable';
import formatMessage from '../../format-message';
import moment from 'moment-timezone';
import { getFullDateAndTime } from '../../utilities/dateUtils';
import Button from 'instructure-ui/lib/components/Button';
import Container from 'instructure-ui/lib/components/Container';
import Link from 'instructure-ui/lib/components/Link';
import Pill from 'instructure-ui/lib/components/Pill';
import IconXLine from 'instructure-icons/lib/Line/IconXLine';
import { string, number} from 'prop-types';
import styles from './styles.css';
import theme from './theme.js';

export class Opportunity extends Component {
  static propTypes = {
    dueAt: string.isRequired,
    points: number,
    courseName: string.isRequired,
    opportunityTitle: string.isRequired,
    timeZone: string.isRequired,
    url: string.isRequired
  }

  constructor (props) {
    super(props);

    const tzMomentizedDate = moment.tz(props.dueAt, props.timeZone);
    this.fullDate = getFullDateAndTime(tzMomentizedDate);
  }

  render () {
    return (
      <div className={styles.root}>

        <header className={styles.header}>
          <div className={styles.oppName}>
            {this.props.courseName}
          </div>
          <div className={styles.close}>
            <Button variant="icon" size="small">
              <IconXLine title={formatMessage("Close")} />
            </Button>
          </div>
        </header>

        <Container as="div" margin="0 0 small">
          <Link href={this.props.url}>{this.props.opportunityTitle}</Link>
        </Container>

        <footer className={styles.footer}>
          <div className={styles.status}>
            <Pill text="Badge list..." />
            <div className={styles.due}>
              <span className={styles.dueText}>
                {formatMessage('Due:')}</span> {this.fullDate}
            </div>
          </div>
          <div className={styles.points}>
            <span className={styles.pointsNumber}>
              {this.props.points}
            </span>
            {formatMessage("points")}
          </div>
        </footer>

      </div>
    );
  }
}

export default themeable(theme, styles)(Opportunity);
