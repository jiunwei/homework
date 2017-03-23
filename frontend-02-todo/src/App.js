import React, { Component } from 'react';
import TaskManager from './TaskManager';
import './App.css';

const EMPTY_TASKS = [
  {
    title: 'To do',
    tasks: []
  },
  {
    title: 'In Progress',
    tasks: []
  },
  {
    title: 'Done',
    tasks: []
  }
]

class App extends Component {
  render() {
    return (<TaskManager nextId={0} taskLists={EMPTY_TASKS} />);
  }
}

export default App;
