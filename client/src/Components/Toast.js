import "./css/Toast.css"

const colorMap = {
    normal: "bg-light",
    error: "bg-danger text-white",
    success: "bg-success text-white",
    info: "bg-info"
};

export default function Toast(props) {

    return (
      <div className={`toast p-2 ${colorMap[props.type]}`}
        style={{
            display: (props.isShowing ? "block" : "none"),
        }}
      >
        {props.children}
      </div>
    );
};