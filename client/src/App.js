import React, { useState, useEffect } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import { DragDropContext } from 'react-beautiful-dnd';
import Column from './Components/Column';

const BASE_TASK_STRUCTURE = {
  id: "0",
  title: "New Task"
};

function App() {
  const [columnOrder, setColumnOrder] = useState([]);
  const [columnId, setColumnId] = useState(0);
  const [taskId, setTaskId] = useState(0);
  
  const [columns, setColumns] = useState({});

  const onDragEnd = result => {
    const {source, destination} = result;

    if (!destination) {
      return;
    }

    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }

    if (source.droppableId === destination.droppableId) {
      // Move Tasks around
      const columnCopy = {...columns[source.droppableId]};
      const tasksCopy = [...columnCopy.tasks];
      const [removed] = tasksCopy.splice(source.index, 1);
      tasksCopy.splice(destination.index, 0, removed);

      const newColumn = {
        ...columnCopy,
        tasks: tasksCopy
      };

      setColumns({
        ...columns,
        [source.droppableId]: newColumn
      })

    } else if (source.droppableId !== destination.droppableId) {

      // Remove task from source column
      const sourceColumn = {...columns[source.droppableId]};
      const sourceTasks = [...sourceColumn.tasks];
      const [movedTask] = sourceTasks.splice(source.index, 1);
      
      // Add task to destination column
      const destinationColumn = {...columns[destination.droppableId]};
      const destinationTasks = [...destinationColumn.tasks];
      destinationTasks.splice(destination.index, 0, movedTask);

      const newColumns = {
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          tasks: sourceTasks
        },
        [destination.droppableId]: {
          ...destinationColumn,
          tasks: destinationTasks
        }
      };

      setColumns(newColumns);
    }
  };

  const addColumn = () => {
    const newId = columnId.toString();

    const newColumn = {
      title: "New List",
      tasks: []
    };

    const newColumns = {
      ...columns,
      [newId]: newColumn
    }

    const newColumnOrder = [...columnOrder];
    newColumnOrder.push(newId);

    setColumns(newColumns);
    setColumnOrder(newColumnOrder);
    setColumnId(columnId + 1);
  };

  const addTask = (id) => {
    const newTaskId = taskId.toString();

    const newTask = {
      ...BASE_TASK_STRUCTURE,
      id: newTaskId,
      title: `New Task ${newTaskId}`
    };

    const columnCopy = {...columns[id]};

    columnCopy.tasks.push(newTask);

    setColumns({
      ...columns,
      [id]: columnCopy
    });
    setTaskId(taskId + 1);
  };

  return (
    <div className="list-group list-group-horizontal my-2 mx-3">
      <DragDropContext onDragEnd={onDragEnd}>
        {columnOrder.map((cid) => (
          <Column 
            key={cid}
            id={cid}
            onTaskAdd={addTask}
            {...columns[cid]}
          />
        ))}
      </DragDropContext>
      <div className="m-2">
        <input type="button" value="Add Column" className="btn btn-secondary" onClick={addColumn}/>
      </div>
    </div>
  );
}

export default App;
