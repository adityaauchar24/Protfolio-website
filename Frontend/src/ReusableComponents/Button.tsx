import React from "react";

type ButtonType = {
  name: string;
  routeId: string;
  className?: string;
};

const Button = ({ name, routeId, className, onClick = {} }: ButtonType) => {
  return (
    <button
      className={`py-2 w-40 border-3 rounded-lg cursor-pointer text-white font-medium ${className?.replace(
        /,/g,
        " "
      )}`}
      onClick={onClick}
    >
      <a href={routeId}> {name} </a>
    </button>
  );
};

export default Button;
