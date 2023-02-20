import React, { useState } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import Column from './Components/Column';


function App() {
  const [columnOrder, setColumnOrder] = useState([]);
  const [columnId, setColumnId] = useState(0);
  const [taskId, setTaskId] = useState(0);
  const [columns, setColumns] = useState({});

  const onDragEnd = result => {
    const {source, destination, type, draggableId} = result;

    if (!destination) {
      return;
    }

    // Won't have to do anything if the item being dropped is being put to the same location it was.
    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }

    if (type === "task") {
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
        });

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
    } else if (type === "column") {
      const newColumnOrder = [...columnOrder];
      newColumnOrder.splice(source.index, 1);
      newColumnOrder.splice(destination.index, 0, draggableId);

      setColumnOrder(newColumnOrder);
    }
  };

  // Column Functions
  const addColumn = () => {
    const newColumnId = `c-${columnId.toString()}`;

    const newColumn = {
      title: "New List",
      tasks: []
    };

    const newColumns = {
      ...columns,
      [newColumnId]: newColumn
    }

    const newColumnOrder = [...columnOrder];
    newColumnOrder.push(newColumnId);

    setColumns(newColumns);
    setColumnOrder(newColumnOrder);
    setColumnId(columnId + 1);
  };

  const renameColumn = (e, columnId) => {
    const newColumn = {
      ...columns[columnId],
      title: e.target.value
    };

    const newColumns = {
      ...columns,
      [columnId]: newColumn
    }

    setColumns(newColumns);
  };

  // Task Functions
  const addTask = (columnId) => {
    const newTaskId = `t-${taskId.toString()}`;

    const newTask = {
      id: newTaskId,
      title: `New Task ${newTaskId}`
    };

    const columnCopy = {...columns[columnId]};

    columnCopy.tasks.push(newTask);

    setColumns({
      ...columns,
      [columnId]: columnCopy
    });
    setTaskId(taskId + 1);
  };

  return (
    <div className="list-group list-group-horizontal mt-2 mx-3">
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="columns" direction="horizontal" type="column">
          {(provided) => (
            <div
              className="list-group list-group-horizontal overflow-y-hidden"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {columnOrder.map((cid, index) => (
                <Column 
                  key={cid}
                  id={cid}
                  onTaskAdd={addTask}
                  {...columns[cid]}
                  index={index}
                  onNameChange={renameColumn}
                />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <div className="m-2">
        <input type="button" value="Add Column" className="btn btn-secondary" onClick={addColumn}/>
      </div>
    </div>
  );
}

export default App;
