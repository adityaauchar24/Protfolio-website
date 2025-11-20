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
    if (!url || url.includes('localhost')) {
      alert("This project is not currently deployed");
      return;
    }
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const ProjectCard = ({ project, index }: ProjectCardProps) => (
    <div 
      className={`group relative bg-white rounded-2xl xs:rounded-3xl shadow-lg hover:shadow-2xl border border-gray-200/50 overflow-hidden transition-all duration-500 hover:scale-105 ${
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
          className="w-full h-48 xs:h-56 sm:h-64 object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-3 xs:bottom-4 left-3 xs:left-4 right-3 xs:right-4">
            <div className="flex flex-wrap gap-1 xs:gap-2">
              {project.technologies.map((tech, techIndex) => (
                <span 
                  key={techIndex}
                  className="px-2 xs:px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs rounded-full border border-white/30"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Featured Badge */}
        {project.featured && (
          <div className="absolute top-3 xs:top-4 left-3 xs:left-4 px-2 xs:px-3 py-1 bg-linear-to-r from-red-600 to-red-500 text-white text-xs font-semibold rounded-full shadow-lg">
            Featured
          </div>
        )}

        {/* Category Badge */}
        <div className="absolute top-3 xs:top-4 right-3 xs:right-4 px-2 xs:px-3 py-1 bg-black/70 backdrop-blur-sm text-white text-xs rounded-full">
          {project.category}
        </div>

        {/* Action Buttons */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex gap-2 xs:gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <button
            onClick={() => openInNewTab(project.liveUrl)}
            className="p-2 xs:p-3 bg-white text-gray-900 rounded-xl xs:rounded-2xl shadow-lg hover:shadow-xl hover:scale-110 active:scale-95 transition-all duration-300 group/btn touch-manipulation min-h-11 min-w-11 flex items-center justify-center"
            title="View Live Demo"
            type="button"
          >
            <LaunchIcon className="group-hover/btn:scale-110 transition-transform duration-300 text-lg xs:text-xl" />
          </button>
          <button
            onClick={() => openInNewTab(project.gitUrl)}
            className="p-2 xs:p-3 bg-gray-900 text-white rounded-xl xs:rounded-2xl shadow-lg hover:shadow-xl hover:scale-110 active:scale-95 transition-all duration-300 group/btn touch-manipulation min-h-11 min-w-11 flex items-center justify-center"
            title="View Source Code"
            type="button"
          >
            <GitHubIcon className="group-hover/btn:scale-110 transition-transform duration-300 text-lg xs:text-xl" />
          </button>
        </div>
      </div>

      {/* Project Content */}
      <div className="p-4 xs:p-6">
        <div className="flex items-start justify-between mb-2 xs:mb-3">
          <h3 className="text-lg xs:text-xl font-bold text-gray-900 group-hover:text-red-600 transition-colors duration-300">
            {project.name}
          </h3>
        </div>
        
        <p className="text-gray-600 leading-relaxed mb-3 xs:mb-4 text-sm xs:text-base line-clamp-3">
          {project.detail}
        </p>

        {/* Technologies */}
        <div className="flex flex-wrap gap-1 xs:gap-2 mb-3 xs:mb-4">
          {project.technologies.slice(0, 3).map((tech, techIndex) => (
            <span 
              key={techIndex}
              className="px-2 xs:px-3 py-1 bg-gray-100 text-gray-700 text-xs xs:text-sm rounded-full border border-gray-200"
            >
              {tech}
            </span>
          ))}
          {project.technologies.length > 3 && (
            <span className="px-2 xs:px-3 py-1 bg-gray-100 text-gray-500 text-xs xs:text-sm rounded-full">
              +{project.technologies.length - 3}
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 xs:gap-3 mt-6 xs:mt-8">
          <button
            onClick={() => openInNewTab(project.liveUrl)}
            className="flex items-center gap-1 xs:gap-2 px-3 xs:px-4 py-2 bg-linear-to-r from-red-600 to-red-500 text-white font-semibold rounded-xl xs:rounded-2xl hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 flex-1 justify-center touch-manipulation min-h-11 text-sm xs:text-base"
            type="button"
          >
            <OpenInNewIcon sx={{ fontSize: "1rem xs:1.2rem" }} />
            <span>Live Demo</span>
          </button>
          <button
            onClick={() => openInNewTab(project.gitUrl)}
            className="flex items-center gap-1 xs:gap-2 px-3 xs:px-4 py-2 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl xs:rounded-2xl hover:border-red-300 hover:bg-red-50 hover:text-red-600 hover:scale-105 active:scale-95 transition-all duration-300 touch-manipulation min-h-11 min-w-11 justify-center"
            type="button"
          >
            <GitHubIcon sx={{ fontSize: "1rem xs:1.2rem" }} />
          </button>
        </div>
      </div>

      {/* Hover Effect Border */}
      <div className="absolute inset-0 rounded-2xl xs:rounded-3xl border-2 border-transparent group-hover:border-red-500/20 transition-all duration-300 pointer-events-none"></div>
    </div>
  );

  return (
    <section id="projects" className="relative py-12 xs:py-16 lg:py-24 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-48 h-48 xs:w-72 xs:h-72 bg-red-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 xs:w-72 xs:h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
      
      <div className="container mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 relative z-10 max-w-7xl">
        {/* Section Header */}
        <div className={`text-center mb-12 xs:mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex items-center gap-2 xs:gap-3 mb-3 xs:mb-4">
            <div className="w-4 xs:w-6 h-0.5 bg-linear-to-r from-red-600 to-red-400"></div>
            <span className="text-xs xs:text-sm font-semibold text-red-600 uppercase tracking-wider">
              My Work
            </span>
            <div className="w-4 xs:w-6 h-0.5 bg-linear-to-r from-red-400 to-red-600"></div>
          </div>
          <h2 className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-bold bg-linear-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-3 xs:mb-4">
            Featured Projects
          </h2>
          <p className="text-sm xs:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto px-2 xs:px-0">
            Here are some of my recent projects that showcase my skills in frontend development, 
            responsive design, and modern web technologies.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 xs:gap-6 lg:gap-8">
          {projectData.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>

        {/* Call to Action */}
        <div className={`text-center mt-12 xs:mt-16 transition-all duration-700 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <p className="text-gray-600 mb-4 xs:mb-6 text-sm xs:text-base">
            Interested in seeing more? Check out my GitHub for additional projects and code samples.
          </p>
          <button
            onClick={() => openInNewTab("https://github.com/adityaauchar24")}
            className="inline-flex items-center gap-2 xs:gap-3 px-6 xs:px-8 py-3 xs:py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl xs:rounded-2xl hover:border-red-300 hover:bg-red-50 hover:text-red-600 hover:scale-105 active:scale-95 transition-all duration-300 touch-manipulation min-h-11 text-sm xs:text-base"
            type="button"
          >
            <GitHubIcon sx={{ fontSize: "1.2rem" }} />
            <span>View All Projects on GitHub</span>
          </button>
        </div>
      </div>

      {/* Responsive Styles */}
      <style>{`
        /* Line clamp utility */
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* Touch device optimizations */
        @media (hover: none) and (pointer: coarse) {
          .hover\\:scale-105:hover {
            transform: none;
          }
          .group-hover\\:scale-110:hover {
            transform: none;
          }
          .group-hover\\:opacity-100:hover {
            opacity: 0.7;
          }
        }

        /* Reduced motion for accessibility */
        @media (prefers-reduced-motion: reduce) {
          .transition-all,
          .hover\\:scale-105,
          .group-hover\\:scale-110,
          .animate-pulse {
            transition: none;
            animation: none;
          }
        }

        /* High DPI optimization */
        @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
          .project-image {
            image-rendering: -webkit-optimize-contrast;
            image-rendering: crisp-edges;
          }
        }

        /* Very small screens optimization */
        @media (max-width: 320px) {
          .project-card-compact {
            margin: 0.25rem;
          }
        }

        /* Large screen optimization */
        @media (min-width: 1920px) {
          .project-card-large {
            max-width: 28rem;
          }
        }

        /* Landscape mode optimization */
        @media (max-height: 500px) and (orientation: landscape) {
          .projects-section {
            padding-top: 4rem;
            padding-bottom: 4rem;
          }
        }

        /* Print styles */
        @media print {
          .project-action-buttons {
            display: none;
          }
          
          .project-card {
            break-inside: avoid;
            margin-bottom: 1rem;
          }
        }

        /* Dark mode support */
        @media (prefers-color-scheme: dark) {
          .project-card-dark {
            background-color: #1f2937;
            border-color: #374151;
          }
          
          .project-text-dark {
            color: #d1d5db;
          }
        }

        /* Reduced data mode */
        @media (prefers-reduced-data: reduce) {
          .project-image {
            loading: lazy;
          }
          
          .background-animations {
            display: none;
          }
        }
      `}</style>
    </section>
  );
};

export default Projects;