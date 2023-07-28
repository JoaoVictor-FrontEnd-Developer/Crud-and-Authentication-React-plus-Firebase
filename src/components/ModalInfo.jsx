import React from "react";

function ModalInfo({ text, title }) {
  return (
    <div className="bg-body rounded-3 p-2 my-3">
      <div className="p-3">
        <div className="text-center me-auto">
          {title}
        </div>
        <div className="text-center">
          {text}
        </div>
      </div>
    </div>
  );
}

export default ModalInfo;
