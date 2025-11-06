import React, { useState } from "react";
import HomeIcon from "@mui/icons-material/Home";
import PsychologyIcon from "@mui/icons-material/Psychology";
import GroupsIcon from "@mui/icons-material/Groups";
import PermContactCalendarIcon from "@mui/icons-material/PermContactCalendar";
import ImportantDevicesIcon from "@mui/icons-material/ImportantDevices";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navData = [
    {
      name: "Home",
      id: "#home",
      icon: <HomeIcon />,
    },
    {
      name: "About",
      id: "#about",
      icon: <GroupsIcon />,
    },
    {
      name: "Skills",
      id: "#skills",
      icon: <PsychologyIcon />,
    },
    {
      name: "Projects",
      id: "#projects",
      icon: <ImportantDevicesIcon />,
    },
    {
      name: "Contact",
      id: "#contact",
      icon: <PermContactCalendarIcon />,
    },
  ];

  const handleToggle = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLinkClick = () => {
    setMenuOpen(false); // Close on click (mobile)
  };

  return (
    <div className="flex gap-13 cursor-pointer">
      <>
        {/* Desktop nav */}
        <div className="hidden md:flex gap-8 cursor-pointer">
          {navData.map((navItem, ind) => (
            <a
              key={ind}
              href={navItem.id}
              className="flex items-center gap-2 text-base font-medium text-red-800 hover:text-black transition"
            >
              {navItem.icon}
              <span>{navItem.name}</span>
            </a>
          ))}
        </div>
      </>

      {/* Toggle Icon */}
      <div className="md:hidden text-3xl text-red-800" onClick={handleToggle}>
        {menuOpen ? <CloseIcon /> : <MenuIcon />}
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden px-6 pb-6 bg-white shadow-md absolute top-20 right-12 w-52">
          <div className="flex flex-col gap-4">
            {navData.map((navItem, ind) => (
              <a
                key={ind}
                href={navItem.id}
                onClick={handleLinkClick}
                className="flex items-center gap-3 py-2 text-base font-medium text-red-800 hover:bg-[#F5F5F5] cursor-pointer transition"
              >
                {navItem.icon}
                <span>{navItem.name}</span>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
