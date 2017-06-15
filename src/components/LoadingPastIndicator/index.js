import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Container from 'instructure-ui/lib/components/Container';
import Spinner from 'instructure-ui/lib/components/Spinner';
import Typography from 'instructure-ui/lib/components/Typography';
import formatMessage from 'format-message';
import {animateSlideDown} from '../../utilities/scrollUtils';

export default class LoadingPastIndicator extends Component {
  static propTypes = {
    onComponentWillUnmount: PropTypes.func,
  }

  componentDidMount () {
    if (this.rootDiv) animateSlideDown(this.rootDiv);
  }

  componentWillUnmount () {
    if (this.props.onComponentWillUnmount) this.props.onComponentWillUnmount();
  }

  rootDiv = (elt) => {
    this.rootDiv = elt;
  }

  render () {
    return <div ref={this.rootDiv}>
      <Container as="div" padding="small" textAlign="center">
        <Container display="inline">
          <Spinner size="small" margin="0 x-small 0 0" title={formatMessage('Loading past items')}/>
        </Container>
        <Typography size="small" color="secondary">
          {formatMessage('Loading past items')}
        </Typography>
      </Container>
    </div>;
  }
}
