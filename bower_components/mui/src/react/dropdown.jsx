/**
 * MUI React dropdowns module
 * @module react/dropdowns
 */
/* jshint quotmark:false */
// jscs:disable validateQuoteMarks

'use strict';

import React from 'react';

import Button from './button';
import Caret from './caret';
import * as jqLite from '../js/lib/jqLite';
import * as util from '../js/lib/util';


const PropTypes = React.PropTypes,
      dropdownClass = 'mui-dropdown',
      menuClass = 'mui-dropdown__menu',
      openClass = 'mui--is-open',
      rightClass = 'mui-dropdown__menu--right';


/**
 * Dropdown constructor
 * @class
 */
class Dropdown extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      opened: false,
      menuTop: 0
    }

    let cb = util.callback;
    this.onClickCB = cb(this, 'onClick');
    this.onOutsideClickCB = cb(this, 'onOutsideClick');
  }

  static propTypes = {
    color: PropTypes.oneOf(['default', 'primary', 'danger', 'dark',
      'accent']),
    variant: PropTypes.oneOf(['default', 'flat', 'raised', 'fab']),
    size: PropTypes.oneOf(['default', 'small', 'large']),
    label: PropTypes.string,
    alignMenu: PropTypes.oneOf(['left', 'right']),
    onClick: PropTypes.func,
    disabled: PropTypes.bool
  };

  static defaultProps = {
    className: '',
    color: 'default',
    variant: 'default',
    size: 'default',
    label: '',
    alignMenu: 'left',
    onClick: null,
    disabled: false
  };

  componentWillMount() {
    document.addEventListener('click', this.onOutsideClickCB);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.onOutsideClickCB);
  }

  onClick(ev) {
    // only left clicks
    if (ev.button !== 0) return;

    // exit if toggle button is disabled
    if (this.props.disabled) return;

    if (!ev.defaultPrevented) this.toggle();
  }

  toggle() {
    // exit if no menu element
    if (!this.props.children) {
      return util.raiseError('Dropdown menu element not found');
    }

    if (this.state.opened) this.close();
    else this.open();
  }

  open() {
    // position menu element below toggle button
    let wrapperRect = this.refs.wrapperEl.getBoundingClientRect(),
        toggleRect;

    toggleRect = this.refs.button.refs.buttonEl.getBoundingClientRect();

    this.setState({
      opened: true,
      menuTop: toggleRect.top - wrapperRect.top + toggleRect.height
    });
  }

  close() {
    this.setState({opened: false});
  }

  select() {
    if (this.props.onClick) this.props.onClick(this, ev);
  }

  onOutsideClick(ev) {
    let isClickInside = this.refs.wrapperEl.contains(ev.target);
    if (!isClickInside) this.close();
  }

  render() {
    let buttonEl,
        menuEl;

    buttonEl = (
      <Button
        ref="button"
        type="button"
        onClick={this.onClickCB}
        color={this.props.color}
        variant={this.props.variant}
        size={this.props.size}
        disabled={this.props.disabled}
      >
        {this.props.label}
        <Caret />
      </Button>
    );

    if (this.state.opened) {
      let cs = {};

      cs[menuClass] = true;
      cs[openClass] = this.state.opened;
      cs[rightClass] = (this.props.alignMenu === 'right');
      cs = util.classNames(cs);

      menuEl = (
        <ul
          ref="menuEl"
          className={cs}
          style={{top: this.state.menuTop} }
          onClick={this.selectCB}
        >
          {this.props.children}
        </ul>
      );
    }

    let { ref, className, children, ...other } = this.props;

    return (
      <div
        { ...other }
        ref="wrapperEl"
        className={dropdownClass + ' ' + className}
      >
        {buttonEl}
        {menuEl}
      </div>
    );
  }
}


/** Define module API */
export default Dropdown;
