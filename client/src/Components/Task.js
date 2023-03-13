import { useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import { useSubmit, Form } from "react-router-dom";
import Modal from "./Modal";

import "./css/Task.css";

export default function Task(props) {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [taskCopy, setTaskCopy] = useState({
        title: props.title,
        description: props.description,
        hasChanged: false
    });

    const taskId = props.id.substr(2);

    const submit = useSubmit();

    const onClick = e => {
        e.preventDefault();
        setIsModalVisible(true);
    };

    const onCancelClicked = e => {
        e.preventDefault();
        setIsModalVisible(false);
        setTaskCopy({
            title: props.title,
            description: props.description,
            hasChanged: false
        });
    }

    const onChange = (e, field) => {
        setTaskCopy({
            ...taskCopy,
            [field]: e.target.value,
            hasChanged: true
        });
    }

    const onSubmit = e => {
        e.preventDefault();
        setIsModalVisible(false);
        console.log(taskCopy);
        if (taskCopy.hasChanged) {
            submit({
                columnId: props.columnId,
                type: "TASK",
                taskId: taskId,
                title: taskCopy.title,
                description: taskCopy.description
            }, {method: "POST"});
        }
    }

    return (
        <>
            <Modal isShowing={isModalVisible} onCancel={onCancelClicked} title={"View/Edit Task"}>
                <Form method="POST" onSubmit={onSubmit}>
                    <div className="my-3">
                        <label htmlFor="taskName" className="form-label">Task Name</label>
                        <input id="taskName" type="text" className="form-control" name="title"
                            value={taskCopy.title || ""}
                            onChange={e => onChange(e, "title")}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="taskDescription" className="form-label">Description</label>
                        <textarea id="taskDescription" className="form-control mh-100" rows={5} name="description"
                            onChange={e => onChange(e, "description")}
                            value={taskCopy.description || ""}
                        ></textarea>
                    </div>
                    <div className="mb-3" style={{justifyContent: "end"}}>
                        <input type="button" className="btn btn-secondary me-3" onClick={onCancelClicked} value={taskCopy.hasChanged ? "Cancel" : "Close"}/>
                        <input type="submit" className="btn btn-primary" value="Save Changes"
                            style={{
                                display: taskCopy.hasChanged ? "inline" : "none"
                            }}
                        />
                    </div>
                </Form>
            </Modal>
            <Draggable draggableId={props.id} index={props.index}>
                {(provided) => (
                    <div 
                        className="task my-2 p-2 border rounded-3 text-truncate lh-sm"
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
        </>
    );
}