import React, { Component } from 'react';
import { render } from 'react-dom';
import styles from './App.css';
import C from '../common/constants';

export default class App extends Component {
  constructor(props) {
    super(props);
    
    this.state = {};
  }

  componentDidMount() {
  }

  render() {
    return (
      <div className="page">
        electron react sample
      </div>
    );
  }
}