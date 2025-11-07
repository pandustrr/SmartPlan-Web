import { Link } from "react-router-dom";
import { Sun, Moon } from "lucide-react";

const Navbar = ({ isDarkMode, toggleDarkMode }) => {
    return (
        <nav className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md fixed top-0 left-0 w-full z-50 border-b border-gray-200 dark:border-gray-700">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold text-gray-900 dark:text-white">
                    <span className="text-green-600 dark:text-green-400">Plan</span>Web
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center space-x-8">
                    <Link to="/" className="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 font-medium transition-colors">
                        Home
                    </Link>
                    <Link to="#features" className="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 font-medium transition-colors">
                        Fitur
                    </Link>
                    <Link to="#about" className="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 font-medium transition-colors">
                        Tentang
                    </Link>
                    <Link to="#contact" className="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 font-medium transition-colors">
                        Kontak
                    </Link>
                </div>

                <div className="flex items-center space-x-4">
                    {/* Dark Mode Toggle */}
                    <button
                        onClick={toggleDarkMode}
                        className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        aria-label="Toggle dark mode"
                    >
                        {isDarkMode ? (
                            <Sun size={20} className="text-yellow-500" />
                        ) : (
                            <Moon size={20} className="text-gray-600" />
                        )}
                    </button>

                    <Link
                        to="/login"
                        className="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 font-medium transition-colors"
                    >
                        Login
                    </Link>
                    <Link
                        to="/register"
                        className="bg-green-600 text-white px-6 py-2 rounded-lg 
                                hover:bg-green-700 transform hover:-translate-y-0.5 
                                transition duration-200 ease-in-out 
                                font-medium shadow-lg hover:shadow-xl"
                    >
                        Mulai Gratis
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;