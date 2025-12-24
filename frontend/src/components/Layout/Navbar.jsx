import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Moon, Sun } from "lucide-react";

function Navbar({ isDarkMode, toggleDarkMode }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  // Tutup menu otomatis saat viewport berubah ke desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isOpen) setIsOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isOpen]);

  return (
    <nav className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md fixed top-0 left-0 w-full z-50 border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* ========== LOGO ========== */}
        <Link to="/" className="flex items-center space-x-2">
          <img
            src={isDarkMode ? "/assets/logo/logo-dark.png" : "/assets/logo/logo-light.png"}
            alt="Grapadi Strategix"
            className="h-14 w-auto object-contain"
            onError={(e) => {
              // Fallback to text if image not found
              e.target.style.display = "none";
              e.target.nextSibling.style.display = "block";
            }}
          />
          <span className="text-2xl font-bold text-gray-900 dark:text-white" style={{ display: "none" }}>
            <span style={{ color: "#167814" }}>Grapadi</span> Strategix
          </span>
        </Link>

        {/* ========== DESKTOP MENU ========== */}
        <div className="hidden md:flex items-center space-x-8">
          <Link
            to="/"
            className="text-gray-700 dark:text-gray-300 font-medium transition-colors"
            style={{ ":hover": { color: "#084404" } }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#167814")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "")}
          >
            Home
          </Link>
          <a href="#features" className="text-gray-700 dark:text-gray-300 font-medium transition-colors" onMouseEnter={(e) => (e.currentTarget.style.color = "#167814")} onMouseLeave={(e) => (e.currentTarget.style.color = "")}>
            Features
          </a>
          {/* <a
            href="#about"
            className="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 font-medium transition-colors"
          >
            About
          </a> */}
          {/* <a
            href="#contact"
            className="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 font-medium transition-colors"
          >
            Contact
          </a> */}
        </div>

        {/* ========== DARK MODE + CTA BUTTONS (DESKTOP) ========== */}
        <div className="hidden md:flex items-center space-x-4">
          <button onClick={toggleDarkMode} className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors" aria-label="Toggle dark mode">
            {isDarkMode ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-gray-600" />}
          </button>

          <Link to="/login" className="text-gray-700 dark:text-gray-300 font-medium transition-colors" onMouseEnter={(e) => (e.currentTarget.style.color = "#084404")} onMouseLeave={(e) => (e.currentTarget.style.color = "")}>
            Sign In
          </Link>
          <Link
            to="/register"
            className="text-white px-6 py-2 rounded-lg transition-all font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5 duration-200"
            style={{ backgroundColor: "#167814" }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#0a5505")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#167814")}
          >
            Mulai Gratis
          </Link>
        </div>

        {/* ========== HAMBURGER BUTTON (MOBILE) ========== */}
        <button className="md:hidden focus:outline-none text-gray-800 dark:text-gray-100 z-50" onClick={toggleMenu}>
          {isOpen ? <X size={28} className="dark:text-black" /> : <Menu size={28} />}
        </button>

        {/* ========== MOBILE MENU (FULLSCREEN) ========== */}
        <div
          className={`fixed inset-0 z-40 flex flex-col items-center justify-center dark:bg-gray-800 bg-white h-200 transition-all duration-500 ease-in-out transform ${
            isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full pointer-events-none"
          }`}
        >
          <ul className="w-full space-y-6 text-center dark:text-white font-medium text-lg">
            <li>
              <Link to="/" className="hover:text-green-600 transition-colors" onClick={() => setIsOpen(false)}>
                Home
              </Link>
            </li>
            <li>
              <a href="#features" className="hover:text-green-600 transition-colors" onClick={() => setIsOpen(false)}>
                Features
              </a>
            </li>
            <li>
              <a href="#about" className="hover:text-green-600 transition-colors" onClick={() => setIsOpen(false)}>
                About
              </a>
            </li>
            <li>
              <a href="#contact" className="hover:text-green-600 transition-colors" onClick={() => setIsOpen(false)}>
                Contact
              </a>
            </li>
            <li className="w-full px-8">
              <Link to="/signup" className="block w-full text-center border-2 border-green-600 text-green-600 py-3 rounded-md hover:bg-green-50 dark:hover:bg-gray-800 transition" onClick={() => setIsOpen(false)}>
                Sign Up
              </Link>
            </li>
            <li className="w-full px-8 -mt-4">
              <Link to="/signin" className="block w-full text-center bg-green-600 text-white py-3 rounded-md hover:bg-green-700 transition" onClick={() => setIsOpen(false)}>
                Sign In
              </Link>
            </li>
            <li className="mt-6">
              <button onClick={toggleDarkMode} className="p-3 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors" aria-label="Toggle dark mode">
                {isDarkMode ? <Sun size={22} className="text-yellow-400" /> : <Moon size={22} className="text-gray-600" />}
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
