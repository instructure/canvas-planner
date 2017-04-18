import React, { Component } from 'react';
import 'instructure-ui/lib/themes/canvas';
import PlannerItem from '../PlannerItem';

export default class PlannerApp extends Component {
  constructor (props) {
    super(props);
    this.state = {
      response: ''
    };
  }

  render () {
    return (
      <ol style={{listStyleType: 'none', margin: 0, padding: 0}}>
        <PlannerItem
          color="#d71f85"
          completed
          id={5}
          associated_item='Quiz'
          title='This is an assignment'
          points={25}
          toggleCompletion={() => console.log('send me back to canvas')}
        />
      </ol>
    )
  }
}
