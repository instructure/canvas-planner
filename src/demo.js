/******************************************************************************
 *
 * IMPORTANT: This file is only used for the "demo"/dev environment that is
 * set up via webpack-dev-server.  It should *NOT* be bundled into the production
 * package.
 *
 ****************************************************************************/

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';

import 'instructure-ui/lib/themes/canvas';
import CanvasPlanner, { store as PlannerStore } from './index';
import { addDay } from '../src/actions';

import Button from 'instructure-ui/lib/components/Button';
import Select from 'instructure-ui/lib/components/Select';
import Grid, { GridCol, GridRow } from 'instructure-ui/lib/components/Grid';
import Typography from 'instructure-ui/lib/components/Typography';

const header_mount_point = document.getElementById('header_mount_point');
CanvasPlanner.renderHeader(header_mount_point);

const mount_point = document.getElementById('mount_point');
CanvasPlanner.render(mount_point, {
  courses: [{
    id: "1",
    longName: "World History I",
  }, {
    id: "2",
    longName: "English Literature",
  }],
});

/***************
* Things below this point deal with the demo area setting bar only
***************/

const demo_only_mount_point = document.getElementById('demo_only_mount');

const locales = ["en", "ar", "da", "de", "en-AU", "en-GB", "es", "fa", "fr-CA",
                 "fr", "he", "ht", "hy", "ja", "ko", "mi", "nl", "nb", "nn", "pl",
                 "pt", "pt-BR", "ru", "sv", "tr", "zh-Hans", "zh-Hant"];

class DemoArea extends Component {
  constructor (props) {
    super(props);
    this.state = {
      timeZone: 'America/Denver',
      locale: 'en'
    };
    this.dayCount = 3;
  }

  handleChange = (e) => {
    e.preventDefault();
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  handleAddDay = (e) => {
    e.preventDefault();
    const fakeDay = moment().add(this.dayCount, 'days');
    PlannerStore.dispatch(addDay(fakeDay.format('YYYY-MM-DD')));
    this.dayCount++;
  }

  componentWillUpdate (nextProps, nextState) {
    CanvasPlanner.render(mount_point, { ...nextState });
    CanvasPlanner.renderHeader(header_mount_point, { ...nextState });
  }

  render () {
      return (
        <div style={{ backgroundColor: 'papayawhip', padding: '10px'}}>
          <Typography weight="bold" color="error">
            This area is only shown here, not in production
          </Typography>
          <Grid vAlign="middle">
            <GridRow>
              <GridCol>
                <Select
                  id="localeSelect"
                  label="Locale"
                  layout="inline"
                  value={this.state.locale}
                  onChange={this.handleChange}
                  name="locale"
                  size="small"
                  width="100px"
                >
                  {
                    locales.map(l => <option key={l} value={l}>{l}</option>)
                  }
                </Select>
              </GridCol>
              <GridCol>
                <Select
                  id="tzSelect"
                  name="timeZone"
                  value={this.state.timeZone}
                  onChange={this.handleChange}
                  size="small"
                  width="200px"
                  layout="inline"
                  label="Timezone"
                >
                  {
                    moment.tz.names().map(tz => <option key={tz} value={tz}>{tz}</option>)
                  }
                </Select>
              </GridCol>
              <GridCol>
                <Button
                  onClick={this.handleAddDay}
                >
                  Add a day
                </Button>
              </GridCol>
            </GridRow>
          </Grid>

        </div>

      );
  }
}


ReactDOM.render(
  <DemoArea />
  , demo_only_mount_point
);
