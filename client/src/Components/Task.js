import { Draggable } from "react-beautiful-dnd";
import "./css/Task.css";

export default function Task(props) {
    const onClick = e => {
        e.preventDefault();
        props.onTaskClick(props.index);
    };

    return (
        <Draggable draggableId={props.id} index={props.index}>
            {(provided) => (
                <div 
                    className="task my-2 p-2 border rounded-3 text-truncate"
                    style={{
                        maxWidth: "200px"
                    }}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    onClick={onClick}
                >
                    <span>{props.title}</span>
                </div>
            )}
        </Draggable>
    );
}