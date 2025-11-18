import { useState, useEffect } from "react";
import ticTacToeGameImg from "../Images/ticTacToeGameImg.png";
import protfolioWebsiteImg from "../Images/protfolioWebsiteImg.png";
import madiraWebImg from "../Images/madiraWebImg.png";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import GitHubIcon from "@mui/icons-material/GitHub";
import LaunchIcon from "@mui/icons-material/Launch";

interface Project {
  id: number;
  name: string;
  detail: string;
  img: string;
  gitUrl: string;
  liveUrl: string;
  technologies: string[];
  category: string;
  featured: boolean;
}

interface ProjectCardProps {
  project: Project;
  index: number;
}

const Projects = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [, setHoveredProject] = useState<number | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    const element = document.getElementById('projects');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const projectData: Project[] = [
    {
      id: 1,
      name: "Tic Tac Toe Game",
      detail: "A modern, interactive Tic Tac Toe game built with React featuring real-time gameplay, win detection, and responsive design. Includes game history and player turn indicators.",
      img: ticTacToeGameImg,
      gitUrl: "https://github.com/adityaauchar24/Tic-Tac-Toe-Game",
      liveUrl: "http://localhost:5174/",
      technologies: ["React.js", "Node.js", "MongoDB", "Redux"],
      category: "Game Development",
      featured: true
    },
    {
      id: 2,
      name: "Portfolio Website",
      detail: "A professional portfolio website showcasing projects and skills with modern UI/UX design. Features smooth animations, responsive layout, and contact form integration.",
      img: protfolioWebsiteImg,
      gitUrl: "https://github.com/adityaauchar24/Protfolio-website",
      liveUrl: "http://localhost:4174/",
      technologies: ["React.js", "Node.js", "MongoDB", "Redux"],
      category: "Web Development",
      featured: true
    },
    {
      id: 3,
      name: "Business Website",
      detail: "A responsive static website for business showcasing services and contact information. Built with modern web standards and optimized for performance across all devices.",
      img: madiraWebImg,
      gitUrl: "https://github.com/adityaauchar24/Mandiri-website",
      liveUrl: "http://localhost:3000/",
      technologies: ["React.js", "Node.js", "MongoDB", "Redux"],
      category: "Business Website",
      featured: false
    },
  ];

  const openInNewTab = (url: string) => {
    if (!url) {
      alert("This project is not currently deployed");
      return;
    }
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const ProjectCard = ({ project, index }: ProjectCardProps) => (
    <div 
      className={`group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl border border-gray-200/50 overflow-hidden transition-all duration-500 hover:scale-105 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
      style={{ transitionDelay: `${300 + index * 100}ms` }}
      onMouseEnter={() => setHoveredProject(project.id)}
      onMouseLeave={() => setHoveredProject(null)}
    >
      {/* Project Image */}
      <div className="relative overflow-hidden">
        <img
          src={project.img}
          alt={project.name}
          className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech, techIndex) => (
                <span 
                  key={techIndex}
                  className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs rounded-full border border-white/30"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Featured Badge */}
        {project.featured && (
          <div className="absolute top-4 left-4 px-3 py-1 bg-linear-to-r from-red-600 to-red-500 text-white text-xs font-semibold rounded-full shadow-lg">
            Featured
          </div>
        )}

        {/* Category Badge */}
        <div className="absolute top-4 right-4 px-3 py-1 bg-black/70 backdrop-blur-sm text-white text-xs rounded-full">
          {project.category}
        </div>

        {/* Action Buttons */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <button
            onClick={() => openInNewTab(project.liveUrl)}
            className="p-3 bg-white text-gray-900 rounded-2xl shadow-lg hover:shadow-xl hover:scale-110 active:scale-95 transition-all duration-300 group/btn"
            title="View Live Demo"
          >
            <LaunchIcon className="group-hover/btn:scale-110 transition-transform duration-300" />
          </button>
          <button
            onClick={() => openInNewTab(project.gitUrl)}
            className="p-3 bg-gray-900 text-white rounded-2xl shadow-lg hover:shadow-xl hover:scale-110 active:scale-95 transition-all duration-300 group/btn"
            title="View Source Code"
          >
            <GitHubIcon className="group-hover/btn:scale-110 transition-transform duration-300" />
          </button>
        </div>
      </div>

      {/* Project Content */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-red-600 transition-colors duration-300">
            {project.name}
          </h3>
        </div>
        
        <p className="text-gray-600 leading-relaxed mb-4 line-clamp-3">
          {project.detail}
        </p>

        {/* Technologies */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.technologies.slice(0, 3).map((tech, techIndex) => (
            <span 
              key={techIndex}
              className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full border border-gray-200"
            >
              {tech}
            </span>
          ))}
          {project.technologies.length > 3 && (
            <span className="px-3 py-1 bg-gray-100 text-gray-500 text-sm rounded-full">
              +{project.technologies.length - 3}
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-8">
          <button
            onClick={() => openInNewTab(project.liveUrl)}
            className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-red-600 to-red-500 text-white font-semibold rounded-2xl hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 flex-1 justify-center"
          >
            <OpenInNewIcon sx={{ fontSize: "1.2rem" }} />
            <span>Live Demo</span>
          </button>
          <button
            onClick={() => openInNewTab(project.gitUrl)}
            className="flex items-center gap-2 px-4 py-2 border-2 border-gray-300 text-gray-700 font-semibold rounded-2xl hover:border-red-300 hover:bg-red-50 hover:text-red-600 hover:scale-105 active:scale-95 transition-all duration-300"
          >
            <GitHubIcon sx={{ fontSize: "1.2rem" }} />
          </button>
        </div>
      </div>

      {/* Hover Effect Border */}
      <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-red-500/20 transition-all duration-300 pointer-events-none"></div>
    </div>
  );

  return (
    <section id="projects" className="relative py-16 lg:py-24 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-red-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-6 h-0.5 bg-linear-to-r from-red-600 to-red-400"></div>
            <span className="text-sm font-semibold text-red-600 uppercase tracking-wider">
              My Work
            </span>
            <div className="w-6 h-0.5 bg-linear-to-r from-red-400 to-red-600"></div>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold bg-linear-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
            Featured Projects
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Here are some of my recent projects that showcase my skills in frontend development, 
            responsive design, and modern web technologies.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projectData.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>

        {/* Call to Action */}
        <div className={`text-center mt-16 transition-all duration-700 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <p className="text-gray-600 mb-6">
            Interested in seeing more? Check out my GitHub for additional projects and code samples.
          </p>
          <button
            onClick={() => openInNewTab("https://github.com/adityaauchar24")}
            className="inline-flex items-center gap-3 px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-2xl hover:border-red-300 hover:bg-red-50 hover:text-red-600 hover:scale-105 active:scale-95 transition-all duration-300"
          >
            <GitHubIcon />
            <span>View All Projects on GitHub</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Projects;