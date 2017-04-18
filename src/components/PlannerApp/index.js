import React, { Component } from 'react';
import axios from 'axios';
import formatMessage from '../../format-message';
import 'instructure-ui/lib/themes/canvas';
import Placeholder from '../Placeholder';

export default class PlannerApp extends Component {
  constructor (props) {
    super(props);
    this.state = {
      response: ''
    };
  }

  componentDidMount () {
    axios.get('/api/v1/planner')
         .then((response) => {
           this.setState(() => ({
             response: response.data[0].id
           }));
         });
  }

  render () {
    return (
      <div>
        {formatMessage('This is a placeholder')}
        <div>{this.state.response}</div>
        <Placeholder />
      </div>
    )
  }
}
