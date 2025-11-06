import ProgressBar from "@ramonak/react-progress-bar";
import React from "react";

const skillData = [
  {
    title: "Frontend Development",
    skills: [
      { skill: "React JS", percentage: 95 },
      { skill: "JavaScript", percentage: 87 },
      { skill: "Redux", percentage: 95 },
      { skill: "Redux Saga", percentage: 90 },
      { skill: "HTML", percentage: 98 },
    ],
  },
  {
    title: "Styling Libraries",
    skills: [
      { skill: "CSS", percentage: 98 },
      { skill: "Tailwind CSS", percentage: 90 },
      { skill: "Material UI", percentage: 88 },
      { skill: "Bootstrap", percentage: 88 },
    ],
  },
  {
    title: "Backend Development",
    skills: [
      { skill: "Node.js", percentage: 50 },
      { skill: "Express.js", percentage: 50 },
      { skill: "MongoDB", percentage: 50 },
    ],
  },
];

const Skills = () => {
  return (
    <div id="skills" className="mb-18">
      <div className="flex items-center justify-center">
        <span className="text-xl font-medium text-black font-extrabold my-8">
          MY SKILLS
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-14">
        {skillData?.map((elem) => (
          <div className="border-2 rounded-md p-6 border-3 border-black-700 w-full">
            <h4 className="pb-3 text-lg font-medium text-red-800">
              {" "}
              {elem.title}{" "}
            </h4>
            {elem.skills.map((item) => (
              <>
                <div className="py-4 font-medium"> {item.skill} </div>
                <ProgressBar completed={item.percentage} bgColor="#9F0712" />
              </>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Skills;
