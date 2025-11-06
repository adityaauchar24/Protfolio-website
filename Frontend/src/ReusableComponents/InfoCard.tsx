import React from "react";

const InfoCard = ({ data }) => {
  return (
    <div className="border-3 border-black-800 rounded-md w-full md:w-98 py-3 px-6 text-red-800">
      {data?.icon}
      <span className="font-bold ml-1"> {data.title} : </span> <br />
      <span className="font-medium text-black"> {data.detail} </span>
    </div>
  );
};

export default InfoCard;
