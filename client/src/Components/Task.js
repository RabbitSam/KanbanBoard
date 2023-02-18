import React from "react";
import { Draggable } from "react-beautiful-dnd";

export default function Task(props) {

    return (
        <Draggable draggableId={props.id} index={props.index}>
            {(provided) => (
                <div 
                    className="my-2 p-2 border rounded-3 bg-white text-truncate"
                    style={{
                        maxWidth: "200px"
                    }}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                >
                    {props.title}
                </div>
            )}
        </Draggable>
    );
}