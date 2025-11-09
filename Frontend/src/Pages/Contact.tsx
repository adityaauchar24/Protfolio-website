import React, { useEffect, useState } from "react";
import Button from "../ReusableComponents/Button";
import EmailIcon from "@mui/icons-material/Email";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import LocationPinIcon from "@mui/icons-material/LocationPin";
import ToastMess from "../ReusableComponents/ToastMess.tsx";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";


const Contact = () => {
  const contactInfo = [
    { title: "Email", detail: "adityaauchar40@gmail.com", icon: <EmailIcon /> },
    { title: "Number", detail: "+91 8097459014", icon: <LocalPhoneIcon /> },
    {
      title: "Linked In",
      detail: "https://www.linkedin.com/in/aditya-auchar-390147334/",
      icon: <LinkedInIcon />,
    },
    {
      title: "Location",
      detail: "Airoli Navi Mumbai, Maharashtra, India",
      icon: <LocationPinIcon />,
    },
  ];

  const initialForm = {
    fullname: "",
    email: "",
    address: "",
    message: "",
  };

  const placeholders = {
    fullName: "Enter your name",
    Email: "Enter your email",
    Address: "Enter your address",
    Message: "Enter your message",
  };

  const [contactForm, setContactForm] = useState(initialForm);
  const [message, setMessage] = useState({
    type: "",
    mess: "",
  });

  useEffect(() => {
    setTimeout(() => {
      setMessage({ type: "", mess: "" });
    }, 8000);
  }, [message]);

  const handleForm = (field: string, value: string) => {
    setContactForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: any) => {
    if (
      contactForm.fullname &&
      contactForm.email &&
      contactForm.address &&
      contactForm.message
    ) {
      try {
        const res = await fetch(
          `${API_URL}/users`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              fullname: contactForm.fullname,
              email: contactForm.email,
              address: contactForm.address,
              message: contactForm.message,
            }),
          }
        );

        const data = await res.json();
        setMessage({ type: res.ok ? "success" : "error", mess: data._message });
      } catch (error) {
        console.error("API call failed:", error);
      }
    }
  };

  return (
    <div id="contact" className="mb-24">
      <div className="flex items-center justify-center">
        <span className="text-xl font-medium text-black font-extrabold my-8">
          CONTACT US
        </span>
      </div>
      <div className="flex gap-25 px-16 mt-4 flex-wrap">
        <div className="flex-1 p-4">
          <h4 className="pb-3 text-lg font-medium text-red-800">
            {" "}
            CONTACT INFORMATION{" "}
          </h4>
          <p className="text-md my-5 text-black">
            I am currently open to new opportunities and collaborative projects
            where I can contribute my skills and experience in frontend
            development. Let’s connect and build something great together.
          </p>
          {contactInfo?.map((elem) => (
            <div>
              <div className="flex gap-2 text-red-800">
                {elem?.icon}
                <h6 className="text-md font-medium">{elem.title} :</h6>
              </div>
              <p className="mb-5 font-medium"> {elem.detail}</p>
            </div>
          ))}
        </div>
        <div className="flex-1 border-2 rounded-lg py-8 px-6 border-3 border-black-700">
          <h4 className="text-lg font-medium text-black font-bold text-red-800">
            GET IN TOUCH
          </h4>
          <div className="mt-6">
            {Object.keys(contactForm).map((item) => (
              <div className="flex-col">
                <h4 className="text-md font-medium"> {item} : </h4>
                <input
                  type="text"
                  className="my-3 w-lg py-1 px-2 border-2 rounded-md"
                  placeholder={placeholders[item]}
                  value={contactForm[item]}
                  onChange={(e) => handleForm(item, e.target.value)}
                />
              </div>
            ))}
            {message.type && <ToastMess message={message} />}
            <Button
              name="Submit"
              className={`${["border-red-900", "bg-red-800", "mt-10"]}`}
              onClick={(e: any) => handleSubmit(e)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
