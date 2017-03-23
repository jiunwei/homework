// Front-End Engineer Exercise: Todo
// Jiun Wei Chia
// 2017-03-23

import React, { Component, PropTypes } from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import update from 'immutability-helper';
import EntryBar from './EntryBar';
import Counter from './Counter';
import TaskList from './TaskList';
import './TaskManager.css';

class TaskManager extends Component {
  static propTypes = {
    nextId: PropTypes.number,
    taskLists: PropTypes.arrayOf(PropTypes.object)
  };

  static defaultProps = {
    nextId: 0,
    taskLists: [
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
  };

  constructor(props) {
    super(props);
    this.state = {
      taskLists: this.props.taskLists
    }
    this.nextId = this.props.nextId;
    this.addNewTask = this.addNewTask.bind(this);
    this.moveTask = this.moveTask.bind(this);
  }

  addNewTask(title) {
    this.setState({
      taskLists: update(this.state.taskLists, {
        0: {
          tasks: {
            $push: [{ id: this.nextId, title: title }]
          }
        }
      })
    });
    ++this.nextId;
  }

  moveTask(fromListIndex, fromTaskIndex, toListIndex, toTaskIndex) {
    const movedTask = this.state.taskLists[fromListIndex].tasks[fromTaskIndex];
    if (fromListIndex === toListIndex) {
      if (fromTaskIndex === toTaskIndex) return;
      this.setState({
        taskLists: update(this.state.taskLists, {
          [fromListIndex]: {
            tasks: {
              $splice: [
                [fromTaskIndex, 1],
                [toTaskIndex, 0, movedTask]
              ]
            }
          }
        })
      });
    } else {
      this.setState({
        taskLists: update(this.state.taskLists, {
          [fromListIndex]: {
            tasks: {
              $splice: [[fromTaskIndex, 1]]
            }
          },
          [toListIndex]: {
            tasks: {
              $splice: [[toTaskIndex, 0, movedTask]]
            }
          }
        })
      });
    }
  }

  render() {
  	let count = 0;
  	const taskListElements = this.state.taskLists.map((taskList, i) => {
  		count += taskList.tasks.length;
  		return (<TaskList key={i} title={taskList.title} tasks={taskList.tasks} index={i} moveTask={this.moveTask} />);
  	});
    return (
    	<div className="TaskManager">
    		<div className="TaskManager-EntryBar">
	    	  <EntryBar prompt="add project" value="" onEnter={this.addNewTask} />
        </div>
	    	<div className="TaskManager-Counter">
	    		<h1>Total</h1>
	    		<Counter count={count} unit="Project" />
	    	</div>
	    	<div className="TaskManager-Items">
	    		{taskListElements}
	    	</div>
	    </div>
    );
  }
}

export default DragDropContext(HTML5Backend)(TaskManager);
