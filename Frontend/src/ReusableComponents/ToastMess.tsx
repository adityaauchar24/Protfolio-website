import React from "react";

const ToastMess = ({ message }) => {
  return (
    <div
      className={`py-1.5 pl-6 mt-2 border-3 rounded-md font-medium text-white w-lg capitalize
         ${
           message.type == "success"
             ? `bg-green-800 border-green-900`
             : `bg-red-800 border-red-900`
         }
        `}
    >
      {message.mess}
    </div>
  );
};

export default ToastMess;
