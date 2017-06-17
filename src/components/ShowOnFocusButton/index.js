import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { node, object } from 'prop-types';

import themeable from 'instructure-ui/lib/themeable';
import Button from 'instructure-ui/lib/components/Button';
import ScreenReaderContent from 'instructure-ui/lib/components/ScreenReaderContent';

import styles from './styles.css';
import theme from './theme.js';

class ShowOnFocusButton extends Component {

  static propTypes = {
    buttonProps: object,
    srProps: object,
    children: node.isRequired
  };

  constructor (props) {
    super(props);
    this.state = {
      visible: false
    };
  }

  handleFocus = (e) => {
    this.setState({
      visible: true
    }, () => {
      // eslint-disable-next-line react/no-find-dom-node
      findDOMNode(this.btnRef).focus();
    });
  }

  handleBlur = (e) => {
    this.setState({
      visible: false
    });
  }

  renderButton () {
    const { buttonProps, children } = this.props;
    return (
      <Button
        buttonRef={(btn) => { this.btnRef = btn; }}
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}
        {...buttonProps}
      >
        {children}
      </Button>
    );
  }

  renderInvisibleButton () {
    const { srProps } = this.props;
    return (
      <ScreenReaderContent {...srProps}>
        {this.renderButton()}
      </ScreenReaderContent>
    );
  }

  render () {
    if (this.state.visible) {
      return this.renderButton();
    } else {
      return this.renderInvisibleButton();
    }
  }
}

export default themeable(theme, styles)(ShowOnFocusButton);
