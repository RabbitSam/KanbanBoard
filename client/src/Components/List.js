import { useState, useRef, useEffect } from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import Task from './Task';
import "./css/List.css";

function List(props) {
    const [isEditingName, setIsEditingName] = useState(false);
    const inputReference = useRef();

    // If the user is editing, then focus on the input as soon as it renders.
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
    const onClick = e => {
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

    // Task Edit functions
    const onTaskClick = (index) => {
        props.onTaskClick(props.id, index);
    };

    //Style
    const style = {
        maxWidth: "250px"
    };

    return (
        <Draggable 
            draggableId={props.id}
            index={props.index}
        >
            {(provided) => (
                <div
                    className="m-1 border rounded-1 bg-white"
                    {...provided.draggableProps}
                    ref={provided.innerRef}
                >
                    {
                        !isEditingName &&
                        <div 
                            className="px-2 pt-2"
                            style={style}
                            {...provided.dragHandleProps}
                        >
                            <h5
                                className="column-title text-truncate py-2 px-2 rounded"
                                onClick={onClick}
                            >
                                {props.title}
                            </h5>
                        </div>
                    }
                    {
                        isEditingName &&
                        <div 
                            className="px-2 py-2"
                            {...provided.dragHandleProps} 
                            style={style}
                        >
                            <form onSubmit={onSubmit}>
                                <label htmlFor="listName" className="visually-hidden">Enter New Title</label>
                                <input
                                    ref={inputReference}
                                    className="px-2 form-control fs-5 lh-sm"
                                    id="listName"
                                    type="text"
                                    value={props.title}
                                    onChange={onNameChange}
                                    onBlur={onBlur}
                                />
                            </form>
                        </div>
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
                                    className="border-top border-bottom px-2 py-1 bg-light bg-light-subtle"
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                    style={{
                                        overflowY: "auto",
                                        overflowX: "hidden",
                                        maxHeight: "calc(100vh - 303px)",
                                        minHeight: "calc(100vh - 303px)"
                                        // marginBottom: "5px"
                                    }}
                                >
                                    {
                                        props.tasks.map((task, index) => (
                                            <Task 
                                                key={task.id}
                                                index={index}
                                                {...task}
                                                onTaskClick={onTaskClick}
                                            />
                                        ))
                                    }
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                        <div className="d-grid px-2 pb-2 pt-1" style={{width:"100%"}}>
                            <button type="button" className="btn btn-add" style={{width: "100%"}} onClick={addTask}>
                                <i className="bi bi-plus"></i> Add Task
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </Draggable>
    );
}

export default List;