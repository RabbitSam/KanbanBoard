import React from "react";
import "./css/Modal.css"

export default function Modal(props) {
    const onCancel = e => {
        props.onCancel(e);
    };
    
    return (
        <div className="container-fluid my-modal h-100 z-1 position-absolute top-0 start-0" 
            style={{
                display: (props.isShowing ? "block" : "none"),
                overflowY: "hidden"
            }}
        >
            <div className="row mt-5 justify-content-center">
                <div className="col-11 col-sm-10 col-lg-6 bg-white border rounded-3">
                    <div className="row border-bottom py-3">
                        <div className="col-10 pt-2">
                            <h4 className="text-truncate">{props.title}</h4>
                        </div>
                        <div className="col-2 text-end">
                            <button className="btn fs-4 lh-sm" type="button" onClick={onCancel}>
                                <i className="bi bi-x-lg" title="Cancel and Close"></i>
                            </button>
                        </div>
                    </div>
                    <div className="row border-top" style={{
                        maxHeight: "80vh",
                        overflowY: "auto"
                    }}>
                        {props.children}
                    </div>
                </div>
            </div>
        </div>
    );
}