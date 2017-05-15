import React, { Component } from 'react';
import Spinner from 'instructure-ui/lib/components/Spinner';
import formatMessage from 'format-message';

export default class LoadingPastIndicator extends Component {
  render () {
    return <div>
      <Spinner size="small" title={formatMessage('Loading past items...')}/>
      {formatMessage('Loading Past Items...')}
    </div>;
  }
}
