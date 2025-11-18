import { useState, useEffect } from "react";
import profileImg from "../Images/AjayAucharPhoto.png";
import DownloadIcon from "@mui/icons-material/Download";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import CodeIcon from "@mui/icons-material/Code";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

// Import your CV file
import cvFile from "../cv/Aditya_Auchar_React.js&Nodejs_Developer.pdf";

const Home = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [textIndex, setTextIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const roles = [
    "Full Stack Developer", 
    "MERN Stack Developer", 
    "React & Node.js", 
    "Frontend Architect",
    "Backend Developer",
    "UI/UX Engineer"
  ];

  useEffect(() => {
    setIsVisible(true);
    
    // Auto-typing effect for roles with smooth transitions
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setTextIndex((prev) => (prev + 1) % roles.length);
        setIsTransitioning(false);
      }, 500); // Transition duration
    }, 3000); // Increased interval for slower transitions

    return () => clearInterval(interval);
  }, [roles.length]);

  const handleNavigation = (sectionId: string) => {
    const element = document.getElementById(sectionId.replace('#', ''));
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleDownloadCV = () => {
    // Create a link element
    const link = document.createElement('a');
    
    // Use the imported CV file
    link.href = cvFile;
    
    // Set the download attribute with a clean file name
    link.download = 'Aditya_Auchar_Full_Stack_Developer_CV.pdf';
    
    // Append to body, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const stats = [
    { number: "1+", label: "Years Experience", icon: <TrendingUpIcon /> },
    { number: "15+", label: "Projects Completed", icon: <CodeIcon /> },
    { number: "10+", label: "Technologies", icon: <CodeIcon /> },
  ];

  const technologies = ['React', 'Node.js', 'TypeScript', 'MongoDB', 'Express', 'Tailwind'];

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-12">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-linear-to-br from-gray-50 to-white">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-red-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/2 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1500"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-0 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Text Content */}
          <div className={`text-center lg:text-left transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} -mt-40`}>
            {/* Welcome Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 rounded-full mb-12">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-red-700">Welcome to my portfolio</span>
            </div>

            {/* Animated Role Text with Smooth Transition */}
            <div className="h-16 mb-6 flex items-center justify-center lg:justify-start">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-gray-700">
                <span 
                  className={`
                    bg-linear-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent
                    transition-all duration-500 ease-in-out
                    ${isTransitioning ? 'opacity-0 transform translate-y-4' : 'opacity-100 transform translate-y-0'}
                  `}
                >
                  {roles[textIndex]}
                </span>
              </h2>
            </div>

            {/* Description */}
            <p className="text-lg sm:text-xl text-gray-600 leading-relaxed mb-6 max-w-2xl">
              I'm a {" "}
              <strong className="text-gray-900">Full Stack Developer</strong> with{" "}
              <strong className="text-red-600">1+ years</strong> of experience building 
              end-to-end web applications. I specialize in the{" "}
              <strong>MERN Stack (MongoDB, Express.js, React, Node.js)</strong> and modern 
              technologies like{" "}
              <strong>TypeScript, Tailwind CSS, Material UI,</strong> and{" "}
              <strong>RESTful APIs</strong> to create scalable, high-performance, and 
              user-friendly digital solutions.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mb-6 max-w-md mx-auto lg:mx-0 mt-12">
              {stats.map((stat, index) => (
                <div 
                  key={index}
                  className="text-center p-3 rounded-2xl bg-white/50 backdrop-blur-sm border border-gray-200/50 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105"
                >
                  <div className="text-xl font-bold bg-linear-to-r from-red-600 to-red-400 bg-clip-text text-transparent">
                    {stat.number}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-9 mt-9">
              <button
                onClick={() => handleNavigation('#projects')}
                className="group flex items-center justify-center gap-2 px-6 py-3 bg-linear-to-r from-red-600 to-red-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300"
              >
                <span>View My Work</span>
                <div className="group-hover:translate-x-1 transition-transform duration-300">→</div>
              </button>

              <button
                onClick={() => handleNavigation('#contact')}
                className="group flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-red-300 hover:bg-red-50 hover:text-red-600 hover:scale-105 active:scale-95 transition-all duration-300"
              >
                <span>Contact Me</span>
              </button>

              <button
                onClick={handleDownloadCV}
                className="group flex items-center justify-center gap-2 px-4 py-3 text-gray-600 font-medium rounded-xl hover:text-red-600 hover:scale-105 active:scale-95 transition-all duration-300"
              >
                <DownloadIcon sx={{ fontSize: "1.2rem" }} />
                <span>Download CV</span>
              </button>
            </div>

            {/* Quick Links */}
            <div className="flex flex-wrap items-center gap-3 justify-center lg:justify-start">
              {technologies.map((tech) => (
                <div
                  key={tech}
                  className="px-3 py-1 bg-white/50 backdrop-blur-sm border border-gray-200 rounded-full text-sm text-gray-600 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-all duration-300"
                >
                  {tech}
                </div>
              ))}
            </div>
          </div>

          {/* Profile Image - Large Circular Design */}
          <div className={`flex justify-center lg:justify-end transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            <div className="relative">
              {/* Background Gradient Circle */}
              <div className="absolute inset-0 bg-linear-to-br from-blue-500 via-purple-500 to-red-500 rounded-full blur-2xl opacity-20 animate-pulse"></div>
              
              {/* Main Circular Image Container */}
              <div className="relative group">
                {/* Outer Glow Effect */}
                <div className="absolute -inset-6 bg-linear-to-r from-blue-400 to-purple-500 rounded-full opacity-0 group-hover:opacity-30 blur-lg transition-all duration-500"></div>
                
                {/* Large Circular Image with Perfect Fit */}
                <div className="relative w-96 h-96 lg:w-md lg:h-112 rounded-full shadow-2xl border-8 border-white bg-white overflow-hidden">
                  <img
                    src={profileImg}
                    alt="Aditya Auchar - Full Stack Developer"
                    className="w-full h-full object-cover object-center"
                  />
                  
                  {/* Subtle Hover Overlay */}
                  <div className="absolute inset-0 bg-linear-to-br from-blue-500/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
                </div>

              </div>

              {/* Large Animated Rings */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-lg h-128 border-2 border-blue-300/30 rounded-full animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-xl h-144 border-2 border-purple-300/20 rounded-full animate-pulse delay-300 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute -bottom-45 left-1/2 transform -translate-x-1/2 animate-bounce">
          <button
            onClick={() => handleNavigation('#about')}
            className="flex flex-col items-center gap-1 text-gray-400 hover:text-red-600 transition-colors duration-300"
            aria-label="Scroll to next section"
          >
            <span className="text-xs font-medium">Explore More</span>
            <ArrowDownwardIcon sx={{ fontSize: "1.2rem" }} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Home;