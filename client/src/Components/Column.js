import React from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import Task from './Task';

function Column(props) {

    const addTask = e => {
        props.onTaskAdd(props.id);
    }

    return (
        <Draggable 
            draggableId={props.id}
            index={props.index}
        >
            {(provided) => (
                <div
                    className="m-2 border rounded-1 pb-2 bg-white"
                    {...provided.draggableProps}
                    ref={provided.innerRef}
                >
                    <h4 className="text-truncate py-2 px-2" {...provided.dragHandleProps}>{props.title}</h4>
                    <div
                        style={{
                            minWidth: "250px",
                            maxWidth: "250px"
                        }}
                    >
                        <Droppable droppableId={props.id} direction="vertical" type="task">
                            {(provided) => (
                                <div
                                    className="border border-start-0 border-end-0 p-2 bg-light bg-light-subtle"
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                    style={{
                                        overflowY: "auto",
                                        overflowX: "hidden",
                                        maxHeight: "81vh",
                                        marginBottom: "5px"
                                    }}
                                >
                                    {
                                        props.tasks.map((task, index) => (
                                            <Task 
                                                key={task.id}
                                                index={index}
                                                {...task}
                                            />
                                        ))
                                    }
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                        <div className='container' style={{width:"100%"}}>
                            <input type="button" className='btn btn-light' value="Add Item" style={{width: "100%"}} onClick={addTask}/>
                        </div>
                    </div>
                </div>
            )}
        </Draggable>
    );
}

export default Column;