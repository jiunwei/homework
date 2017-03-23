// Front-End Engineer Exercise: Todo Unit Tests
// Jiun Wei Chia
// 2017-03-23

import React from 'react';
import ReactTestUtils from 'react-addons-test-utils'
import renderer from 'react-test-renderer';
import { DragDropContext } from 'react-dnd';
import TestBackend from 'react-dnd-test-backend';
import TaskManager from './TaskManager';
import TaskList from './TaskList';
import Task from './Task';

const SAMPLE_TASKS = [
  {
    title: 'To do',
    tasks: [
      { id: 0, title: 'Project 1' },
      { id: 1, title: 'Project 2' },
      { id: 2, title: 'Project 3' },
      { id: 3, title: 'Project 4' }
    ]
  },
  {
    title: 'In Progress',
    tasks: [
      { id: 4, title: 'Project 5' },
      { id: 5, title: 'Project 6' },
      { id: 6, title: 'Project 7' }
    ]
  },
  {
    title: 'Done',
    tasks: [
      { id: 7, title: 'Project 8' },
      { id: 8, title: 'Project 9' },
      { id: 9, title: 'Project 10' },
      { id: 10, title: 'Project 11' },
      { id: 11, title: 'Project 12' }
    ]
  }
];

describe('TaskManager', () => {

  it('renders a set of empty tasks correctly', () => {
    const layout = renderer.create(<TaskManager />).toJSON();
    expect(layout).toMatchSnapshot();
  });

  it('renders a set of sample tasks correctly', () => {
    const layout = renderer.create(<TaskManager nextId={12} taskLists={SAMPLE_TASKS} />).toJSON();
    expect(layout).toMatchSnapshot();
  });

  describe('#addNewTask()', () => {

    it('adds tasks to the first task list when called directly', () => {
      // Need to unwrap drag-and-drop context using getDecoratedComponentInstance().
      const taskManager = ReactTestUtils.renderIntoDocument(<TaskManager nextId={12} taskLists={SAMPLE_TASKS} />).getDecoratedComponentInstance();
      const beforeCounts = taskManager.state.taskLists.map((taskList) => taskList.tasks.length);

      taskManager.addNewTask('Project 1');
      taskManager.addNewTask('Project 2');
      taskManager.addNewTask('Project 3');

      const taskLists = taskManager.state.taskLists;
      const afterCounts = taskLists.map((taskList) => taskList.tasks.length);
      expect(afterCounts[0]).toEqual(beforeCounts[0] + 3);
      expect(afterCounts[1]).toEqual(beforeCounts[1]);
      expect(afterCounts[2]).toEqual(beforeCounts[2]);
      const lastTasks = taskLists[0].tasks.slice(-3);
      expect(lastTasks[0].title).toEqual('Project 1');
      expect(lastTasks[1].title).toEqual('Project 2');
      expect(lastTasks[2].title).toEqual('Project 3');
    });

    it('adds tasks to the first task list when called via the EntryBar', () => {
      const taskManager = ReactTestUtils.renderIntoDocument(<TaskManager nextId={12} taskLists={SAMPLE_TASKS} />);
      const taskLists = ReactTestUtils.scryRenderedComponentsWithType(taskManager, TaskList);
      const beforeCounts = taskLists.map((component) => component.props.tasks.length);

      const form = ReactTestUtils.findRenderedDOMComponentWithTag(taskManager, 'form');
      const input = ReactTestUtils.findRenderedDOMComponentWithTag(taskManager, 'input');
      ReactTestUtils.Simulate.change(input, {target: {value: 'Project 1'}});
      ReactTestUtils.Simulate.submit(form);
      ReactTestUtils.Simulate.change(input, {target: {value: 'Project 2'}});
      ReactTestUtils.Simulate.submit(form);
      ReactTestUtils.Simulate.change(input, {target: {value: 'Project 3'}});
      ReactTestUtils.Simulate.submit(form);

      const afterCounts = taskLists.map((component) => component.props.tasks.length);
      expect(afterCounts[0]).toEqual(beforeCounts[0] + 3);
      expect(afterCounts[1]).toEqual(beforeCounts[1]);
      expect(afterCounts[2]).toEqual(beforeCounts[2]);
      const lastTasks = taskLists[0].props.tasks.slice(-3);
      expect(lastTasks[0].title).toEqual('Project 1');
      expect(lastTasks[1].title).toEqual('Project 2');
      expect(lastTasks[2].title).toEqual('Project 3');
    });

  });

  describe('#moveTask()', () => {

    it('moves a task to the right location when called directly', () => {
      // Need to unwrap drag-and-drop context using getDecoratedComponentInstance().
      const taskManager = ReactTestUtils.renderIntoDocument(<TaskManager nextId={12} taskLists={SAMPLE_TASKS} />).getDecoratedComponentInstance();
      const beforeCounts = taskManager.state.taskLists.map((taskList) => taskList.tasks.length);

      taskManager.moveTask(0, 1, 2, 2);
      taskManager.moveTask(1, 1, 1, 2);
      taskManager.moveTask(1, 2, 1, 2);
      taskManager.moveTask(2, 1, 1, 0);

      const taskLists = taskManager.state.taskLists;
      const afterCounts = taskLists.map((taskList) => taskList.tasks.length);
      expect(afterCounts[0]).toEqual(beforeCounts[0] - 1);
      expect(afterCounts[1]).toEqual(beforeCounts[1] + 1);
      expect(afterCounts[2]).toEqual(beforeCounts[2]);
      expect(taskLists[0].tasks[0].title).toEqual('Project 1');
      expect(taskLists[0].tasks[1].title).toEqual('Project 3');
      expect(taskLists[0].tasks[2].title).toEqual('Project 4');
      expect(taskLists[1].tasks[0].title).toEqual('Project 9');
      expect(taskLists[1].tasks[1].title).toEqual('Project 5');
      expect(taskLists[1].tasks[2].title).toEqual('Project 7');
      expect(taskLists[1].tasks[3].title).toEqual('Project 6');
      expect(taskLists[2].tasks[0].title).toEqual('Project 8');
      expect(taskLists[2].tasks[1].title).toEqual('Project 2');
      expect(taskLists[2].tasks[2].title).toEqual('Project 10');
      expect(taskLists[2].tasks[3].title).toEqual('Project 11');
      expect(taskLists[2].tasks[4].title).toEqual('Project 12');
    });

    it('moves a task to the right location when called via drag and drop', () => {
      const TestTaskManager = DragDropContext(TestBackend)(
        class TestTaskManager extends React.Component {
          render() {
            return (<TaskManager.DecoratedComponent nextId={12} taskLists={SAMPLE_TASKS} />);
          }
        }
      );
      const taskManager = ReactTestUtils.renderIntoDocument(<TestTaskManager />);
      const backend = taskManager.getManager().getBackend();
      const taskLists = ReactTestUtils.scryRenderedComponentsWithType(taskManager, TaskList);
      const beforeCounts = taskLists.map((component) => component.props.tasks.length);
      const beforeTasks = taskLists.map((taskList) => ReactTestUtils.scryRenderedComponentsWithType(taskList, Task));

      // Simulate first drag-and-drop in more detail.
      const source = beforeTasks[0][1];
      const intervening = beforeTasks[1][2];
      const target = beforeTasks[2][2];
      // Need to unwrap the DragTarget to reach the DragSource handler ID.
      backend.simulateBeginDrag([source.getDecoratedComponentInstance().getHandlerId()]);
      backend.simulateHover([source.getHandlerId()]);
      backend.simulateHover([intervening.getHandlerId()]);
      backend.simulateHover([target.getHandlerId()]);
      backend.simulateDrop();
      backend.simulateEndDrag();

      // Simulate remaining drag-and-drop actions.
      backend.simulateBeginDrag([beforeTasks[1][1].getDecoratedComponentInstance().getHandlerId()]);
      backend.simulateHover([beforeTasks[1][2].getHandlerId()]);
      backend.simulateDrop();
      backend.simulateEndDrag();
      backend.simulateBeginDrag([beforeTasks[1][2].getDecoratedComponentInstance().getHandlerId()]);
      backend.simulateHover([beforeTasks[1][2].getHandlerId()]);
      backend.simulateDrop();
      backend.simulateEndDrag();
      backend.simulateBeginDrag([beforeTasks[2][1].getDecoratedComponentInstance().getHandlerId()]);
      backend.simulateHover([beforeTasks[1][0].getHandlerId()]);
      backend.simulateDrop();
      backend.simulateEndDrag();

      const afterTasks = taskLists.map((taskList) => ReactTestUtils.scryRenderedComponentsWithType(taskList, Task));
      const afterCounts = taskLists.map((component) => component.props.tasks.length);
      expect(afterCounts[0]).toEqual(beforeCounts[0] - 1);
      expect(afterCounts[1]).toEqual(beforeCounts[1] + 1);
      expect(afterCounts[2]).toEqual(beforeCounts[2]);
      expect(afterTasks[0][0].props.title).toEqual('Project 1');
      expect(afterTasks[0][1].props.title).toEqual('Project 3');
      expect(afterTasks[0][2].props.title).toEqual('Project 4');
      expect(afterTasks[1][0].props.title).toEqual('Project 9');
      expect(afterTasks[1][1].props.title).toEqual('Project 5');
      expect(afterTasks[1][2].props.title).toEqual('Project 7');
      expect(afterTasks[1][3].props.title).toEqual('Project 6');
      expect(afterTasks[2][0].props.title).toEqual('Project 8');
      expect(afterTasks[2][1].props.title).toEqual('Project 2');
      expect(afterTasks[2][2].props.title).toEqual('Project 10');
      expect(afterTasks[2][3].props.title).toEqual('Project 11');
      expect(afterTasks[2][4].props.title).toEqual('Project 12');
    });

  });

});
