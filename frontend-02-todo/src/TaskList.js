import React, { Component } from 'react';
import { DropTarget } from 'react-dnd';
import Constants from './Constants';
import Counter from './Counter';
import Task from './Task';
import './TaskList.css';

const targetSpec = {
  hover(props, monitor, component) {
    const dragItem = monitor.getItem();
    // Don't count a task if we are appending to a list that it already belongs in.
    const targetIndex = (dragItem.listIndex === props.index) ? (props.tasks.length - 1) : props.tasks.length;
    props.moveTask(dragItem.listIndex, dragItem.index, props.index, targetIndex);
    monitor.getItem().listIndex = props.index;
    monitor.getItem().index = targetIndex;
  }
}

class TaskList extends Component {
  render() {
  	const { title, tasks, index, moveTask, connectTarget } = this.props;
  	const taskElements = tasks.map((task, i) => (<li key={i}><Task id={task.id} title={task.title} listIndex={index} index={i} moveTask={moveTask} /></li>));
    return (
    	<div className="TaskList">
        <h1>{title}</h1>
    		<div className="TaskList-Counter"><Counter count={tasks.length} unit="Project" /></div>
    		<ol className="TaskList-Items">
          {taskElements}
          {connectTarget(<li className="TaskList-Buffer">&nbsp;</li>)}
        </ol>
    	</div>
    );
  }
}

TaskList = DropTarget(Constants.TASK, targetSpec, (connect, monitor) => {
  return {
    connectTarget: connect.dropTarget()
  };
})(TaskList);

export default TaskList;
