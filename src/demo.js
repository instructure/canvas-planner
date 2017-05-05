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
import CanvasPlanner from './index';

const header_mount_point = document.getElementById('header_mount_point');
CanvasPlanner.renderHeader(header_mount_point);

const mount_point = document.getElementById('mount_point');
CanvasPlanner.render(mount_point);

/***************
* Things below this point deal with the demo area setting bar only
***************/

const demo_only_mount_point = document.getElementById('demo_only_mount');

const locales = ["en", "ar", "da", "de", "en-AU", "en-GB", "es", "fa", "fr-CA",
                 "fr", "he", "ht", "hy", "ja", "ko", "mi", "nl", "nb", "nn", "pl",
                 "pt", "pt-BR", "ru", "sv", "tr", "zh-Hans", "zh-Hant"];


// const handleTzChange = (e) => {
//   e.preventDefault();
//   const timeZone = e.target.value;
//   CanvasPlanner.render(mount_point, { timeZone });
// };
//
// const handleLocaleChange = (e) => {
//   e.preventDefault();
//   const locale = e.target.value;
//   CanvasPlanner.render(mount_point, { locale });
// };

class DemoArea extends Component {
  constructor (props) {
    super(props);
    this.state = {
      timeZone: 'America/Denver',
      locale: 'en'
    };
  }

  handleChange = (e) => {
    e.preventDefault();
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  componentWillUpdate (nextProps, nextState) {
    CanvasPlanner.render(mount_point, { ...nextState });
    CanvasPlanner.renderHeader(header_mount_point, { ...nextState });
  }

  render () {
      return (
        <div style={{ backgroundColor: 'papayawhip', padding: '10px'}}>
          <span style={{ fontWeight: 'bold', color: 'red' }}>
            This area is only shown here, not in production
          </span>
          <div>
            <label htmlFor="localeSelect">Locale</label>
            <select
              id="localeSelect"
              name="locale"
              value={this.state.locale}
              onChange={this.handleChange}
            >
              {
                locales.map(l => <option key={l} value={l}>{l}</option>)
              }
            </select>
            <label htmlFor="tzSelect">Timezone</label>
            <select
              id="tzSelect"
              name="timeZone"
              value={this.state.timeZone}
              onChange={this.handleChange}
            >
              {
                moment.tz.names().map(tz => <option key={tz} value={tz}>{tz}</option>)
              }
            </select>
          </div>

        </div>

      );
  }
}


ReactDOM.render(
  <DemoArea />
  , demo_only_mount_point
);
