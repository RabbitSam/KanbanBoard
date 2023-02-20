import React, { useState, useRef, useEffect } from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import Task from './Task';

function Column(props) {
    const [isEditingName, setIsEditingName] = useState(false);
    const inputReference = useRef();

    useEffect(() => {
        if (inputReference.current) {
            inputReference.current.focus();
        }
    });

    const addTask = e => {
        e.preventDefault();
        props.onTaskAdd(props.id);
    };

    // Name Edit Functions
    const onDoubleClick = e => {
        e.preventDefault();
        setIsEditingName(true);
    };

    const onNameChange = e => {
        props.onNameChange(e, props.id);
    };

    const onBlur = e => {
        e.preventDefault();
        setIsEditingName(false);
    };

    const onSubmit = e => {
        e.preventDefault();
        setIsEditingName(false);
    };

    //

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
                    {
                        !isEditingName &&
                        <h4 
                            className="text-truncate py-2 px-2"
                            {...provided.dragHandleProps}
                            onDoubleClick={onDoubleClick}
                            style={{
                                maxWidth: "250px"
                            }}
                        >
                            {props.title}
                        </h4>
                    }
                    {
                        isEditingName &&
                        <form style={{maxWidth: "250px"}} onSubmit={onSubmit}>
                            <label for="listName" className="visually-hidden">Enter New Title</label>
                            <input
                                ref={inputReference}
                                className="p-2 form-control fs-4"
                                id="listName"
                                type="text"
                                value={props.title}
                                onChange={onNameChange}
                                onBlur={onBlur}
                            />
                        </form>
                    }
                    <div
                        style={{
                            minWidth: "250px",
                            maxWidth: "250px",
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
                                        maxHeight: "82vh",
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