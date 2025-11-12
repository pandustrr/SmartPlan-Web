import { Bell, Search, User, Settings, Menu, Sun, Moon } from "lucide-react";

const Header = ({
  onToggleSidebar,
  isMobile,
  isDarkMode,
  toggleDarkMode,
  user,
}) => {
  const handleDarkModeToggle = () => {
    toggleDarkMode();
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between px-4 lg:px-6 py-4">
        {/* Left Section - Toggle Button dan Search */}
        <div className="flex items-center space-x-3 lg:space-x-4 flex-1">
          {/* Toggle Button untuk sidebar */}
          <button
            onClick={onToggleSidebar}
            className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors lg:hidden"
          >
            <Menu size={20} />
          </button>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
                size={20}
              />
              <input
                type="text"
                placeholder="Cari rencana, laporan, atau analisis..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-sm lg:text-base"
              />
            </div>
          </div>
        </div>

        {/* User Actions */}
        <div className="flex items-center space-x-2 lg:space-x-4">
          {/* Dark Mode Toggle */}
          <button
            onClick={handleDarkModeToggle}
            className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? (
              <Sun size={20} className="text-yellow-500" />
            ) : (
              <Moon size={20} className="text-gray-600" />
            )}
          </button>

          <button className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <Bell size={20} />
            <span className="absolute top-2 right-2 lg:top-1 lg:right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          <button className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <Settings size={20} />
          </button>

          {/* User Info - Simplified */}
          <div className="flex items-center space-x-2 lg:space-x-3 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{
                background:
                  "linear-gradient(to bottom right, #22c55e, #16a34a)",
              }}
            >
              <User size={16} className="text-white" />
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {user?.name || "User"}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {user?.email
                  ? user.email.includes("pro")
                    ? "Pro"
                    : "Free"
                  : "Free"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
