import { useState, useEffect } from "react";
import profileImg from "../Images/AjayAucharPhoto.png";
import EmailIcon from "@mui/icons-material/Email";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import PersonIcon from "@mui/icons-material/Person";
import DownloadIcon from "@mui/icons-material/Download";
import CodeIcon from "@mui/icons-material/Code";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

// Import your CV file
import cvFile from "../cv/Aditya_Auchar_React.js&Nodejs_Developer.pdf";

const About = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    const element = document.getElementById('about');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const InfoDetail = [
    { 
      title: "Name", 
      detail: "Aditya Auchar", 
      icon: <PersonIcon sx={{ fontSize: "1.8rem" }} />,
      color: "from-blue-50 to-blue-100",
      iconColor: "text-blue-500",
      link: null
    },
    { 
      title: "Email", 
      detail: "adityaauchar40@gmail.com", 
      icon: <EmailIcon sx={{ fontSize: "1.8rem" }} />,
      color: "from-green-50 to-green-100",
      iconColor: "text-green-500",
      link: "mailto:adityaauchar40@gmail.com"
    },
    { 
      title: "Phone", 
      detail: "+91 8097459014", 
      icon: <LocalPhoneIcon sx={{ fontSize: "1.8rem" }} />,
      color: "from-purple-50 to-purple-100",
      iconColor: "text-purple-500",
      link: "tel:+918097459014"
    },
    {
      title: "LinkedIn",
      detail: "aditya-auchar-390147334",
      icon: <LinkedInIcon sx={{ fontSize: "1.8rem" }} />,
      color: "from-cyan-50 to-cyan-100",
      iconColor: "text-cyan-500",
      link: "https://www.linkedin.com/in/aditya-auchar-390147334/"
    },
  ];

  const stats = [
    { number: "1+", label: "Years Experience", icon: <WorkspacePremiumIcon /> },
    { number: "10+", label: "Projects Completed", icon: <CodeIcon /> },
    { number: "100%", label: "Client Satisfaction", icon: <TrendingUpIcon /> },
  ];

  const handleConnectClick = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
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

  return (
    <section id="about" className="relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        {/* Section Header */}
        <div className={`text-center mb-16 lg:mb-20 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-6 h-0.5 bg-linear-to-r from-red-600 to-red-400"></div>
            <span className="text-sm font-semibold text-red-600 uppercase tracking-wider">
              About Me
            </span>
            <div className="w-6 h-0.5 bg-linear-to-r from-red-400 to-red-600"></div>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold bg-linear-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Know Me Better
          </h2>
          <p className="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">
            Full Stack Developer crafting digital experiences that make a difference
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-12 lg:gap-16">
          {/* Image Section - Moved to Left */}
          <div className={`flex-1 flex justify-center lg:justify-start transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'} mt-18`}>
            <div className="relative">
              {/* Background Gradient Circle */}
              <div className="absolute inset-0 bg-linear-to-br from-blue-500 via-purple-500 to-red-500 rounded-full blur-2xl opacity-20 animate-pulse"></div>
              
              {/* Main Circular Image Container */}
              <div className="relative group">
                {/* Outer Glow Effect */}
                <div className="absolute -inset-6 bg-linear-to-r from-blue-400 to-purple-500 rounded-full opacity-0 group-hover:opacity-30 blur-lg transition-all duration-500"></div>
                
                {/* Large Circular Image with Perfect Fit */}
                <div className="relative w-80 h-80 lg:w-96 lg:h-96 rounded-full shadow-2xl border-8 border-white bg-white overflow-hidden">
                  <img
                    src={profileImg}
                    alt="Aditya Auchar - Full Stack Developer"
                    className="w-full h-full object-cover object-center"
                  />
                  
                  {/* Subtle Hover Overlay */}
                  <div className="absolute inset-0 bg-linear-to-br from-blue-500/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
                </div>
              </div>

              {/* Animated Rings */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 border-2 border-blue-300/30 rounded-full animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-104 h-104 border-2 border-purple-300/20 rounded-full animate-pulse delay-300 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
          </div>

          {/* Content Section - Moved to Right */}
          <div className={`flex-1 transition-all duration-700 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} -mt-8`}>
            {/* Title & Badge */}
            <div className="flex items-center justify-center lg:justify-start gap-4 mb-8">
              <div className="px-5 py-2 bg-linear-to-r from-red-500 to-red-600 rounded-full text-white font-semibold text-sm shadow-lg">
                Full Stack Developer
              </div>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>

            {/* Introduction */}
            <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-8 text-center lg:text-left">
              Crafting Digital Experiences with <span className="bg-linear-to-r from-red-600 to-red-400 bg-clip-text text-transparent">Precision</span>
            </h3>

            {/* Description */}
            <div className="space-y-6 text-gray-600 text-lg leading-relaxed">
              <p>
                I'm <strong className="text-gray-900">Aditya Auchar</strong>, a results-oriented 
                Full Stack Developer with over 1 year of experience in designing and 
                building high-performance web applications.
              </p>
              <p>
                I specialize in developing modern, interactive user interfaces using 
                cutting-edge technologies like <strong>React.js, JavaScript (ES6+), 
                TypeScript, Redux Toolkit</strong>, and popular UI libraries including 
                <strong> Material UI</strong> and <strong>Tailwind CSS</strong>.
              </p>
              <p>
                My work focuses on delivering clean, scalable, and maintainable code 
                that enhances both user experience and system performance. I have 
                hands-on experience with real-time data communication, efficient 
                REST API integration, and managing complex application states.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 my-10">
              {stats.map((stat, index) => (
                <div 
                  key={index}
                  className={`text-center p-6 rounded-2xl bg-linear-to-br from-gray-50 to-white border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
                  style={{ transitionDelay: `${600 + index * 100}ms` }}
                >
                  <div className="text-3xl font-bold bg-linear-to-r from-red-600 to-red-400 bg-clip-text text-transparent">
                    {stat.number}
                  </div>
                  <div className="text-sm text-gray-600 mt-2 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Contact Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
              {InfoDetail.map((item, index) => (
                <a
                  key={index}
                  href={item.link || '#'}
                  onClick={(e) => !item.link && e.preventDefault()}
                  className={`group p-5 rounded-xl border border-gray-200 bg-white/95 backdrop-blur-sm transition-all duration-400 hover:border-transparent hover:shadow-md ${isVisible ? 'opacity-100' : 'opacity-0'}`}
                  style={{ transitionDelay: `${800 + index * 100}ms` }}
                >
                  <div className="flex flex-col items-center text-center gap-4">
                    {/* Professional Icon with Subtle Animations */}
                    <div className={`relative p-3 rounded-xl bg-linear-to-br ${item.color} transition-all duration-400 group-hover:scale-105`}>
                      <div className={`${item.iconColor} transition-all duration-400 group-hover:scale-110`}>
                        {item.icon}
                      </div>
                      
                      {/* Subtle Pulse Effect */}
                      <div className={`absolute inset-0 rounded-xl bg-linear-to-br ${item.color} opacity-0 group-hover:opacity-100 custom-ping-slow`}></div>
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-500 mb-1 transition-all duration-400 group-hover:text-gray-600">
                        {item.title}
                      </div>
                      <div className="text-gray-800 font-semibold text-sm transition-all duration-400 group-hover:text-gray-900">
                        {item.detail}
                      </div>
                    </div>
                  </div>
                  
                  {/* Subtle Background Glow on Hover */}
                  <div className={`absolute inset-0 rounded-xl bg-linear-to-br ${item.color} opacity-0 group-hover:opacity-5 transition-all duration-400 -z-10`}></div>
                </a>
              ))}
            </div>

            {/* Action Buttons with New Professional Animations */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start items-center">
              {/* Let's Connect Button */}
              <button
                onClick={handleConnectClick}
                className="group relative flex items-center justify-center gap-3 px-10 py-4 bg-linear-to-r from-red-600 to-red-500 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 active:scale-95 overflow-hidden"
              >
                {/* Animated Background */}
                <div className="absolute inset-0 bg-linear-to-r from-red-500 to-red-600 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                
                {/* Button Content */}
                <span className="relative z-10">Let's Connect</span>
                <div className="relative z-10 group-hover:translate-x-1 transition-transform duration-300">→</div>
                
                {/* Ripple Effect */}
                <div className="absolute inset-0 rounded-2xl border-2 border-red-400 opacity-0 group-hover:opacity-100 transition-all duration-500 custom-pulse-slow"></div>
              </button>
              
              {/* Download CV Button */}
              <button
                onClick={handleDownloadCV}
                className="group relative flex items-center justify-center gap-3 px-10 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-2xl transition-all duration-500 hover:scale-105 active:scale-95 overflow-hidden"
              >
                {/* Animated Background */}
                <div className="absolute inset-0 bg-linear-to-r from-gray-50 to-white opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                
                {/* Button Content */}
                <DownloadIcon className="relative z-10 transition-all duration-300 group-hover:scale-110 group-hover:text-red-600" />
                <span className="relative z-10 transition-all duration-300 group-hover:text-red-600">Download CV</span>
                
                {/* Border Animation */}
                <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-red-300 transition-all duration-500"></div>
                
                {/* Download Animation Effect */}
                <div className="absolute bottom-0 left-0 w-0 h-1 bg-linear-to-r from-red-500 to-red-600 transition-all duration-700"></div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-red-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>

      {/* Add CSS animations to your global CSS file or use this style tag */}
      <style>
        {`
          @keyframes ping-slow {
            0% {
              transform: scale(1);
              opacity: 0.8;
            }
            75%, 100% {
              transform: scale(1.5);
              opacity: 0;
            }
          }
          @keyframes pulse-slow {
            0%, 100% {
              opacity: 0;
              transform: scale(1);
            }
            50% {
              opacity: 1;
              transform: scale(1.02);
            }
          }
          .custom-ping-slow {
            animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
          }
          .custom-pulse-slow {
            animation: pulse-slow 2s ease-in-out infinite;
          }
        `}
      </style>
    </section>
  );
};

export default About;