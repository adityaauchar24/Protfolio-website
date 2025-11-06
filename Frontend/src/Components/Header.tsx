import React from "react";
import Navbar from "./Navbar";

const Header = () => {
  return (
    <>
      <div className="text-lg font-medium text-black">
        <span className="text-red-800">Dev.</span>Portfolio
      </div>
      <Navbar />
    </>
  );
};

export default Header;
