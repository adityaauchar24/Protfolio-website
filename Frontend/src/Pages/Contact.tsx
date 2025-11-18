import React, { useState, useEffect, useRef, JSX } from "react";
import EmailIcon from "@mui/icons-material/Email";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import LocationPinIcon from "@mui/icons-material/LocationPin";
import SendIcon from "@mui/icons-material/Send";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";

// Use Vite environment variable
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

// TypeScript interfaces
interface ContactInfo {
  title: string;
  detail: string;
  icon: React.ReactElement;
  color: string;
  link: string;
}

interface FormErrors {
  fullname?: string;
  email?: string;
  address?: string;
  message?: string;
}

interface Message {
  type: string;
  mess: string;
}

interface ContactForm {
  fullname: string;
  email: string;
  address: string;
  message: string;
}

interface BackendResponse {
  _message?: string;
  message?: string;
  data?: any;
  error?: string;
  id?: string;
  success?: boolean;
  details?: string[];
}

const Contact = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<Message>({ type: "", mess: "" });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [backendStatus, setBackendStatus] = useState<"checking" | "connected" | "disconnected">("checking");
  const [, setBackendDetails] = useState<string>("");
  const [, setTotalSubmissions] = useState<number>(0);
  const sectionRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    const element = sectionRef.current;
    if (element) observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
    };
  }, []);

  useEffect(() => {
    if (message.type) {
      const timer = setTimeout(() => {
        setMessage({ type: "", mess: "" });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Check backend connection on component mount
  useEffect(() => {
    checkBackendConnection();
  }, []);

  const contactInfo: ContactInfo[] = [
    { 
      title: "Email", 
      detail: "adityaauchar40@gmail.com", 
      icon: <EmailIcon sx={{ fontSize: "1.5rem" }} />,
      color: "from-blue-300 to-blue-400",
      link: "mailto:adityaauchar40@gmail.com"
    },
    { 
      title: "Phone", 
      detail: "+91 8097459014", 
      icon: <LocalPhoneIcon sx={{ fontSize: "1.5rem" }} />,
      color: "from-green-300 to-green-400",
      link: "tel:+918097459014"
    },
    {
      title: "LinkedIn",
      detail: "aditya-auchar-390147334",
      icon: <LinkedInIcon sx={{ fontSize: "1.5rem" }} />,
      color: "from-blue-400 to-blue-500",
      link: "https://www.linkedin.com/in/aditya-auchar-390147334/"
    },
    {
      title: "Location",
      detail: "Airoli, Navi Mumbai, Maharashtra, India",
      icon: <LocationPinIcon sx={{ fontSize: "1.5rem" }} />,
      color: "from-purple-300 to-purple-400",
      link: "https://maps.google.com/?q=Airoli,Navi+Mumbai"
    },
  ];

  const initialForm: ContactForm = {
    fullname: "",
    email: "",
    address: "",
    message: "",
  };

  const [contactForm, setContactForm] = useState<ContactForm>(initialForm);

  const testBackendConnection = async (): Promise<boolean> => {
    try {
      console.log(`🧪 Testing backend connection to: ${API_URL}/api/test`);
      
      const response = await fetch(`${API_URL}/api/test`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log("✅ Backend test successful:", data);
        return true;
      }
      return false;
    } catch (error) {
      console.error("❌ Backend test failed:", error);
      return false;
    }
  };

  const checkBackendConnection = async (): Promise<boolean> => {
    try {
      setBackendStatus("checking");
      setBackendDetails("Checking backend connection...");
      
      console.log(`🔗 Testing backend connection to: ${API_URL}/api/health`);
      
      // First test basic connectivity
      const isReachable = await testBackendConnection();
      if (!isReachable) {
        setBackendStatus("disconnected");
        setBackendDetails("Backend server is not reachable. Make sure it's running on localhost:4000.");
        return false;
      }
      
      const response = await fetch(`${API_URL}/api/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log(`📡 Response status: ${response.status}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log("✅ Backend health check successful:", data);
        
        setBackendStatus("connected");
        setBackendDetails(`Database: ${data.database} | Total Submissions: ${data.totalUsers || 0}`);
        setTotalSubmissions(data.totalUsers || 0);
        return true;
      } else {
        console.error("❌ Backend health check failed:", response.status);
        setBackendStatus("disconnected");
        setBackendDetails(`HTTP ${response.status} - Backend not responding properly`);
        return false;
      }
    } catch (error) {
      console.error("❌ Backend connection error:", error);
      setBackendStatus("disconnected");
      setBackendDetails("Cannot connect to backend server. Make sure it's running on localhost:4000.");
      return false;
    }
  };

  const validateForm = (): boolean => {
    const errors: FormErrors = {};
    
    if (!contactForm.fullname.trim()) {
      errors.fullname = "Full name is required";
    } else if (contactForm.fullname.trim().length < 2) {
      errors.fullname = "Full name should be at least 2 characters";
    } else if (contactForm.fullname.trim().length > 100) {
      errors.fullname = "Full name should not exceed 100 characters";
    }
    
    if (!contactForm.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactForm.email)) {
      errors.email = "Please enter a valid email";
    } else if (contactForm.email.trim().length > 255) {
      errors.email = "Email should not exceed 255 characters";
    }
    
    if (!contactForm.address.trim()) {
      errors.address = "Address is required";
    } else if (contactForm.address.trim().length < 5) {
      errors.address = "Address should be at least 5 characters";
    } else if (contactForm.address.trim().length > 500) {
      errors.address = "Address should not exceed 500 characters";
    }
    
    if (!contactForm.message.trim()) {
      errors.message = "Message is required";
    } else if (contactForm.message.trim().length < 10) {
      errors.message = "Message should be at least 10 characters";
    } else if (contactForm.message.trim().length > 2000) {
      errors.message = "Message should not exceed 2000 characters";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormChange = (field: keyof ContactForm, value: string): void => {
    setContactForm(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const getPlaceholderText = (field: string): string => {
    if (field === 'fullname') return 'Enter your full name (min 2 chars)';
    if (field === 'email') return 'Enter your email address';
    if (field === 'address') return 'Enter your address (min 5 chars)';
    if (field === 'message') return 'Enter your message (min 10 chars)';
    return `Enter your ${field}`;
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    console.log("📝 Form submitted");
    
    if (!validateForm()) {
      setMessage({ type: "error", mess: "Please fix the validation errors above" });
      return;
    }

    // Check backend connection before submitting
    const isConnected = await checkBackendConnection();
    if (!isConnected) {
      setMessage({ 
        type: "error", 
        mess: "Backend server is not reachable. Please make sure the backend is running on localhost:4000." 
      });
      return;
    }

    setIsSubmitting(true);
    console.log("🔄 Submitting form...");

    try {
      console.log("🌐 API URL:", API_URL);
      
      // Prepare data according to backend schema
      const requestData = {
        fullname: contactForm.fullname.trim(),
        email: contactForm.email.trim().toLowerCase(),
        address: contactForm.address.trim(),
        message: contactForm.message.trim()
      };

      console.log("📤 Sending data to backend:", requestData);

      // Try multiple endpoints for better compatibility
      const endpoints = [
        "/users",
        "/api/contact",
        "/contact",
        "/api/send-message",
        "/send-message",
        "/api/messages",
        "/api/submit"
      ];

      let lastError = "Failed to send message. Please try again later.";
      let success = false;
      
      for (const endpoint of endpoints) {
        try {
          console.log(`🔄 Trying endpoint: ${API_URL}${endpoint}`);
          
          const response = await fetch(`${API_URL}${endpoint}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestData),
          });

          console.log(`📨 Response from ${endpoint}:`, response.status);
          
          const data: BackendResponse = await response.json();
          console.log(`📊 Response data from ${endpoint}:`, data);

          if (response.ok && (data.success || data._message === "Successfully submitted")) {
            console.log("✅ Data successfully saved to MongoDB Atlas with ID:", data.id);
            setMessage({ 
              type: "success", 
              mess: data._message || data.message || "Message sent successfully! Your data has been permanently saved to MongoDB Atlas database." 
            });
            setContactForm(initialForm);
            setFormErrors({});
            
            // Reset form
            if (formRef.current) {
              formRef.current.reset();
            }
            
            // Update backend status to show new user count
            setTimeout(() => checkBackendConnection(), 1500);
            success = true;
            break;
          } else {
            lastError = data._message || data.error || data.message || `Request failed with status ${response.status}`;
            console.error(`❌ Endpoint ${endpoint} failed:`, lastError);
            
            // If we get a 409 conflict (duplicate submission), break early
            if (response.status === 409) {
              break;
            }
          }
        } catch (endpointError) {
          console.error(`❌ Endpoint ${endpoint} failed:`, endpointError);
          lastError = `Network error: ${endpointError instanceof Error ? endpointError.message : 'Cannot connect to server'}`;
        }
      }

      // If all endpoints failed
      if (!success) {
        setMessage({ 
          type: "error", 
          mess: lastError
        });
      }

    } catch (error) {
      console.error("❌ API call failed:", error);
      setMessage({ 
        type: "error", 
        mess: `Network error: ${error instanceof Error ? error.message : 'Please check your connection and try again.'}` 
      });
    } finally {
      setIsSubmitting(false);
      console.log("✅ Submission completed");
    }
  };

  const CustomToast = (): JSX.Element | null => {
    if (!message.type) return null;

    return (
      <div className={`
        fixed top-24 right-6 z-50
        flex items-center gap-3
        px-6 py-4
        rounded-2xl
        shadow-2xl
        border-l-4
        backdrop-blur-md
        transform transition-all duration-500
        ${message.type === "success" 
          ? "bg-green-50 border-green-500 text-green-800" 
          : "bg-red-50 border-red-500 text-red-800"
        }
        ${message.mess ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}
      `}>
        {message.type === "success" ? (
          <CheckCircleIcon sx={{ fontSize: "1.5rem" }} />
        ) : (
          <ErrorIcon sx={{ fontSize: "1.5rem" }} />
        )}
        <div>
          <div className="font-semibold">
            {message.type === "success" ? "Success!" : "Error!"}
          </div>
          <div className="text-sm">{message.mess}</div>
        </div>
      </div>
    );
  };



  return (
    <>
      <style>
        {`
          @keyframes gentle-float {
            0%, 100% { transform: translateY(0px) scale(1); }
            50% { transform: translateY(-3px) scale(1.02); }
          }
          @keyframes soft-pulse {
            0%, 100% { opacity: 0.4; transform: scale(1); }
            50% { opacity: 0.6; transform: scale(1.05); }
          }
          @keyframes icon-glow {
            0%, 100% { box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
            50% { box-shadow: 0 6px 20px rgba(0,0,0,0.15); }
          }
          .animate-gentle-float {
            animation: gentle-float 4s ease-in-out infinite;
          }
          .animate-soft-pulse {
            animation: soft-pulse 6s ease-in-out infinite;
          }
          .animate-icon-glow {
            animation: icon-glow 3s ease-in-out infinite;
          }
        `}
      </style>

      <section id="contact" ref={sectionRef} className="relative overflow-hidden py-16 lg:py-24">
        {/* Light Background Elements */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-blue-50 rounded-full mix-blend-multiply opacity-30 animate-soft-pulse"></div>
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-cyan-50 rounded-full mix-blend-multiply opacity-30 animate-soft-pulse delay-2000"></div>
        <div className="absolute top-1/2 left-1/3 w-60 h-60 bg-sky-50 rounded-full mix-blend-multiply opacity-25 animate-soft-pulse delay-4000"></div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-6 h-0.5 bg-linear-to-r from-blue-300 to-blue-200"></div>
              <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-full">
                Get In Touch
              </span>
              <div className="w-6 h-0.5 bg-linear-to-r from-blue-200 to-blue-300"></div>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
              Let's Work Together
            </h2>
            <p className="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">
              Ready to bring your ideas to life? Let's discuss your project and create something amazing.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Contact Information */}
            <div className={`transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 lg:p-10 shadow-lg border border-gray-100">
                <h3 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-6">
                  Contact <span className="bg-linear-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent">Information</span>
                </h3>
                
                <p className="text-gray-600 text-lg leading-relaxed mb-8">
                  I am currently open to new opportunities and collaborative projects where I can contribute my skills and experience in frontend development. Let's connect and build something great together.
                </p>

                <div className="space-y-5">
                  {contactInfo.map((item, index) => (
                    <a
                      key={index}
                      href={item.link}
                      target={item.link.startsWith('http') ? "_blank" : "_self"}
                      rel={item.link.startsWith('http') ? "noopener noreferrer" : ""}
                      className="group flex items-center gap-4 p-5 rounded-2xl border border-gray-200/60 hover:border-blue-200/80 bg-white/60 hover:bg-white/80 backdrop-blur-sm transition-all duration-500 hover:shadow-md"
                    >
                      <div className={`p-3 rounded-xl bg-linear-to-r ${item.color} text-white shadow-sm animate-gentle-float`}>
                        {item.icon}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-500 group-hover:text-gray-600 transition-colors duration-300">
                          {item.title}
                        </div>
                        <div className="text-gray-700 font-semibold group-hover:text-gray-800 transition-colors duration-300">
                          {item.detail}
                        </div>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transform translate-x-3 group-hover:translate-x-0 transition-all duration-500 text-blue-400 text-lg font-light">
                        ›
                      </div>
                    </a>
                  ))}
                </div>

                {/* Backend Status Indicator */}
                <div className="mt-8 p-4 rounded-2xl transition-all duration-300">
                  <div className={`p-4 rounded-xl`}>
                    <div className="flex items-center justify-between mb-2">
                      
                    </div>

                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className={`transition-all duration-700 delay-400 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 lg:p-10 shadow-lg border border-gray-100">
                <h3 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-2">
                  Send Me a <span className="bg-linear-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent">Message</span>
                </h3>
                <p className="text-gray-600 mb-8">I'll get back to you as soon as possible</p>

                <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                  {['fullname', 'email', 'address', 'message'].map((field) => (
                    <div key={field} className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 capitalize">
                        {field === 'fullname' ? 'Full Name' : field}
                        <span className="text-red-500 ml-1">*</span>
                      </label>
                      {field === 'message' ? (
                        <textarea
                          rows={5}
                          value={contactForm[field as keyof ContactForm]}
                          onChange={(e) => handleFormChange(field as keyof ContactForm, e.target.value)}
                          className={`
                            w-full px-4 py-3
                            rounded-2xl
                            border-2
                            bg-white/50
                            backdrop-blur-sm
                            transition-all duration-300
                            focus:outline-none focus:ring-4
                            placeholder-gray-400
                            resize-none
                            ${formErrors[field as keyof FormErrors] 
                              ? "border-red-200 focus:border-red-400 focus:ring-red-400/20" 
                              : "border-gray-200 focus:border-blue-400 focus:ring-blue-400/20"
                            }
                          `}
                          placeholder={getPlaceholderText(field)}
                        />
                      ) : (
                        <input
                          type={field === 'email' ? 'email' : 'text'}
                          value={contactForm[field as keyof ContactForm]}
                          onChange={(e) => handleFormChange(field as keyof ContactForm, e.target.value)}
                          className={`
                            w-full px-4 py-3
                            rounded-2xl
                            border-2
                            bg-white/50
                            backdrop-blur-sm
                            transition-all duration-300
                            focus:outline-none focus:ring-4
                            placeholder-gray-400
                            ${formErrors[field as keyof FormErrors] 
                              ? "border-red-200 focus:border-red-400 focus:ring-red-400/20" 
                              : "border-gray-200 focus:border-blue-400 focus:ring-blue-400/20"
                            }
                          `}
                          placeholder={getPlaceholderText(field)}
                        />
                      )}
                      {formErrors[field as keyof FormErrors] && (
                        <div className="text-red-500 text-sm flex items-center gap-1">
                          <ErrorIcon sx={{ fontSize: "1rem" }} />
                          {formErrors[field as keyof FormErrors]}
                        </div>
                      )}
                    </div>
                  ))}

                  <button
                    type="submit"
                    disabled={isSubmitting || backendStatus !== "connected"}
                    className={`
                      group
                      w-full
                      flex items-center justify-center gap-3
                      px-8 py-4
                      font-semibold
                      rounded-2xl
                      shadow-md
                      transition-all duration-500
                      disabled:opacity-50 disabled:cursor-not-allowed
                      ${isSubmitting || backendStatus !== "connected"
                        ? "bg-gray-400 text-white cursor-not-allowed" 
                        : "bg-linear-to-r from-blue-400 to-blue-500 text-white hover:shadow-lg hover:scale-102 active:scale-98"
                      }
                    `}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : backendStatus !== "connected" ? (
                      <>
                        <ErrorIcon sx={{ fontSize: "1.2rem" }} />
                        <span>Backend Disconnected</span>
                      </>
                    ) : (
                      <>
                        <SendIcon className="group-hover:animate-gentle-float" />
                        <span>Send Message</span>
                        <div className="group-hover:translate-x-1 transition-transform duration-300">→</div>
                      </>
                    )}
                  </button>
                </form>

                <div className="mt-6 text-center">
                  <div className="text-xs text-gray-500">
                    {backendStatus === "connected" 
                      ? "✅ Form data will be permanently saved to MongoDB Atlas database (aditya-protfolio)"
                      : "❌ Backend server required to save data permanently"
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Custom Toast Notification */}
        <CustomToast />
      </section>
    </>
  );
};

export default Contact;