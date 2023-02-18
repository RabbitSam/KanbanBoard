import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import Task from './Task';

function Column(props) {

    const addTask = e => {
        props.onTaskAdd(props.id);
    }

    return (
        <div className="m-2">
            <div className="border p-2" style={{minWidth: "250px", maxWidth: "250px"}}>
                <h4 className="text-truncate pb-2">{props.title}</h4>
                <Droppable droppableId={props.id}>
                    {(provided) => (
                        <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            style={{
                                minHeight: "25px",
                                overflow: "auto",
                                maxHeight: "81vh",
                                paddingRight: "5px",
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
    );
}

export default Column;