import { Form, useSubmit } from 'react-router-dom';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import Column from './Column';


function Board({ board }) {
    const columnOrder = board.columnOrder;

    const submit = useSubmit();

    const onDragEnd = result => {
        const {source, destination, type} = result;

        if (!destination) {
            return;
        }

        // Won't have to do anything if the item being dropped is being put to the same location it was.
        if (source.droppableId === destination.droppableId && source.index === destination.index) {
            return;
        }

        source.droppableId = source.droppableId.substring(2);
        destination.droppableId = destination.droppableId.substring(2);

        submit({
            type: "BOARD",
            editType: "REORDER",
            reorderType: type,
            sourceJson: JSON.stringify(source),
            destinationJson: JSON.stringify(destination),
        }, {method: "POST"});
    };

    return (
        <div className="container-fluid ps-0">
            <div className="list-group list-group-horizontal mt-2">
                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="b-columns" direction="horizontal" type="columns">
                        {(provided) => (
                            <div
                                className="list-group list-group-horizontal"
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                            >
                                {columnOrder.map((column, index) => (
                                    <Column 
                                        key={`c-${column._id}`}
                                        id={`c-${column._id}`}
                                        title={column.title}
                                        tasks={column.tasks}
                                        index={index}
                                    />
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
                <div className="m-1 pe-2 d-grid" style={{
                    maxWidth: "250px",
                    minWidth: "250px"
                }}>
                    <Form method="PUT">
                        <div className="d-none">
                            <input type="text" name="type" value="COLUMN" readOnly/>
                        </div>
                        <button type="submit" className="btn btn-secondary fs-5 col-12 text-start lh-lg py-2">
                            <i className="bi bi-plus-circle"></i> <span className="fs-6">Add Column</span>
                        </button>
                    </Form>
                </div>
            </div>
        </div>
    );
}

export default Board;
