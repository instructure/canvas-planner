import React, { Component } from 'react';
import { connect } from 'react-redux';
import Button from 'instructure-ui/lib/components/Button';
import formatMessage from 'format-message';
import { testAsyncAction } from '../../actions/index';

export class TestComponent extends Component {
  handleClick = (e) => {
    if (e) { e.preventDefault(); }
    this.props.onClick();
  }

  render () {
    return (
      <div>
        <span>{this.props.value}</span>
        <Button
          ref={(c) => { this.innerBtn = c; }}
          onClick={this.handleClick}
        >
          {formatMessage('Click Me!')}
        </Button>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  value: state.test.testValue
});

const mapDispatchToProps = dispatch => ({
  onClick() { dispatch(testAsyncAction()) }
})

export default connect(mapStateToProps, mapDispatchToProps)(TestComponent);
