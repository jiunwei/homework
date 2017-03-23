import React, { Component } from 'react';
import { DragSource, DropTarget } from 'react-dnd';
import Constants from './Constants';
import './Task.css';

const sourceSpec = {
  beginDrag(props) {
    return {
      id: props.id,
      listIndex: props.listIndex,
      index: props.index
    }
  }
}

const targetSpec = {
  hover(props, monitor, component) {
    const dragItem = monitor.getItem();
    props.moveTask(dragItem.listIndex, dragItem.index, props.listIndex, props.index);
    monitor.getItem().listIndex = props.listIndex;
    monitor.getItem().index = props.index;
  }
}

class Task extends Component {
  render() {
  	const { id, title, connectSource, connectTarget, dragItem } = this.props;
    return (
      connectTarget(connectSource(<div className={(dragItem && dragItem.id === id) ? 'Task Task-Ghost' : 'Task'}>{title}</div>))
    );
  }
}

Task = DragSource(Constants.TASK, sourceSpec, (connect, monitor) => {
  return {
    connectSource: connect.dragSource()
  };
})(Task);

Task = DropTarget(Constants.TASK, targetSpec, (connect, monitor) => {
  return {
    connectTarget: connect.dropTarget(),
    dragItem: monitor.getItem()
  };
})(Task);

export default Task;
