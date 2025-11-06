import React, { useState } from "react";
import profileImg from "../Images/AjayAucharPhoto.png";
import Button from "../ReusableComponents/Button";
import About from "./About";
import Skills from "./Skills";
import Projects from "./Projects";
import Contact from "./Contact";

const Home = () => {
  const buttonData = [
    {
      name: "View My Work",
      style: ["border-red-900", "bg-red-800"],
      routeId: "#projects",
    },
    {
      name: "Contact Me",
      style: ["border-black", "bg-black"],
      routeId: "#contact",
    },
  ];

  return (
    <>
      <div id="home" className="flex justify-center items-center py-18">
        <div className="flex flex-col justify-center items-center w-1/2">
          <img
            src={profileImg}
            className="w-70 h-70 rounded-full object-cover border-5 border-red-700"
          />
          <h4 className="text-2xl font-bold mt-3 text-black">Aditya Auchar</h4>
          <h4 className="text-xl font-medium mt-3 text-red-800">
            Frontend Developer
          </h4>
          <p className="text-md mt-3 text-black">
            I am Aditya Auchar, a dedicated Frontend Developer with
            over 1+ yearsof professional experience in designing and 
            developing high-performance, scalable, and responsive web 
            applications. I specialize in leveraging modern technologies 
            such as React.js, JavaScript (ES6+), Redux, TypeScript, CSS,
            Tailwind CSS, Git, Github and Material UI to build intuitive
            and dynamic user interfaces.
          </p>
          <div className="flex gap-6 mt-10">
            {buttonData.map((elem, ind) => (
              <Button
                key={ind}
                name={elem.name}
                routeId={elem.routeId}
                className={`${[...elem.style]}`}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
