import {
  LayoutDashboard,
  FileText,
  DollarSign,
  TrendingUp,
  BarChart3,
  User,
  ChevronRight,
  ChevronLeft,
  X,
  LogOut,
  Workflow,
  Building,
  Package,
  FileChartColumnIncreasing,
  Files,
} from "lucide-react";

const Sidebar = ({
  activeSection,
  setActiveSection,
  activeSubSection,
  setActiveSubSection,
  isOpen,
  onToggle,
  onClose,
  isMobile,
  isDarkMode,
  onLogout,
  user,
}) => {
  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard Utama",
      icon: LayoutDashboard,
      description: "Ringkasan bisnis Anda",
    },
    {
      id: "business-plan",
      label: "Rencana Bisnis",
      icon: FileText,
      description: "Kelola rencana bisnis lengkap",
      subItems: [
        {
          id: "business-background",
          label: "Latar Belakang Bisnis",
          icon: Building,
        },
        { id: "market-analysis", label: "Analisis Pasar", icon: BarChart3 },
        { id: "product-service", label: "Produk & Layanan", icon: Package },
        {
          id: "marketing-strategies",
          label: "Strategi Pemasaran",
          icon: FileChartColumnIncreasing,
        },
        {
          id: "operational-plan",
          label: "Rencana Operasional",
          icon: Workflow,
        },
        {
          id: "executive-summary",
          label: "Executive Summary",
          icon: Files,
        },
      ],
    },
    {
      id: "financial",
      label: "Manajemen Keuangan",
      icon: DollarSign,
      description: "Kelola keuangan bisnis",
    },
    {
      id: "forecast",
      label: "Forecast",
      icon: TrendingUp,
      description: "Prediksi dan perencanaan masa depan",
    },
    {
      id: "analytics",
      label: "Analisis & Grafik",
      icon: BarChart3,
      description: "Analisis data bisnis",
    },
    {
      id: "profile",
      label: "Profil Pengguna",
      icon: User,
      description: "Kelola profil Anda",
    },
  ];

  const handleMenuClick = (itemId) => {
    setActiveSection(itemId);
    setActiveSubSection(""); // Reset sub section ketika pindah menu utama
    if (isMobile) {
      onClose();
    }
  };

  const handleSubMenuClick = (subItemId, e) => {
    e.stopPropagation();
    setActiveSubSection(subItemId);
    if (isMobile) {
      onClose();
    }
  };

  const handleLogout = () => {
    onLogout();
    if (isMobile) {
      onClose();
    }
  };

  return (
    <>
      {/* Sidebar */}
      <div
        className={`
                fixed lg:static inset-y-0 left-0 z-50
                bg-white dark:bg-gray-800 shadow-lg lg:shadow-xl min-h-screen
                transition-all duration-300 ease-in-out
                ${
                  isOpen
                    ? "w-64 translate-x-0"
                    : "-translate-x-full lg:translate-x-0 lg:w-20"
                }
                flex flex-col
            `}
      >
        {/* Logo Section */}
        <div className="p-4 lg:p-6 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
          {isOpen || !isMobile ? (
            <div
              className={`flex items-center justify-between w-full ${
                !isOpen && "lg:justify-center"
              }`}
            >
              {(isOpen || !isMobile) && (
                <div className={`${!isOpen && "lg:hidden"}`}>
                  <h1 className="text-xl lg:text-2xl font-bold text-gray-800 dark:text-white">
                    <span className="text-green-600 dark:text-green-400">
                      Smart
                    </span>
                    Plan
                  </h1>
                  <p className="text-xs lg:text-sm text-gray-500 dark:text-gray-400 mt-1 lg:block hidden">
                    Business Management
                  </p>
                </div>
              )}

              {/* Toggle Button */}
              <button
                onClick={onToggle}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                {isOpen ? (
                  <ChevronLeft
                    size={20}
                    className="text-gray-600 dark:text-gray-300"
                  />
                ) : (
                  <ChevronRight
                    size={20}
                    className="text-gray-600 dark:text-gray-300 lg:block hidden"
                  />
                )}
              </button>

              {/* Close button for mobile */}
              {isMobile && isOpen && (
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors lg:hidden"
                >
                  <X size={20} className="text-gray-600 dark:text-gray-300" />
                </button>
              )}
            </div>
          ) : null}
        </div>

        {/* Menu Items */}
        <nav className="p-2 lg:p-4 space-y-1 lg:space-y-2 flex-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            const hasSubItems = item.subItems && item.subItems.length > 0;
            const isBusinessPlanActive = activeSection === "business-plan";

            return (
              <div key={item.id} className="space-y-1">
                {/* Main Menu Item */}
                <button
                  onClick={() => handleMenuClick(item.id)}
                  className={`w-full flex items-center p-3 rounded-lg transition-all duration-200 group ${
                    isActive
                      ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  <Icon
                    size={20}
                    className={`shrink-0 ${
                      isActive
                        ? "text-green-600 dark:text-green-400"
                        : "text-gray-400 dark:text-gray-500"
                    }`}
                  />

                  {/* Menu Text */}
                  <div
                    className={`
                                        text-left ml-3 flex-1
                                        transition-all duration-200
                                        ${
                                          isOpen
                                            ? "opacity-100 block"
                                            : "lg:opacity-0 lg:absolute lg:-left-96"
                                        }
                                    `}
                  >
                    <div className="font-medium">{item.label}</div>
                    {isOpen && item.description && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {item.description}
                      </div>
                    )}
                  </div>

                  {/* Tooltip for collapsed state */}
                  {!isOpen && !isMobile && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white dark:text-gray-200 text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
                      <div>{item.label}</div>
                      {item.description && (
                        <div className="text-gray-300 text-xs">
                          {item.description}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Active indicator for collapsed state */}
                  {isActive && !isOpen && !isMobile && (
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-green-600 dark:bg-green-400 rounded-r"></div>
                  )}

                  {/* Chevron for items with submenus */}
                  {hasSubItems && (
                    <ChevronRight
                      size={16}
                      className={`
                            shrink-0 transition-transform duration-200 ml-2
                            ${
                              isActive
                                ? "text-green-600 dark:text-green-400 rotate-90"
                                : "text-gray-400 dark:text-gray-500"
                            }
                            ${isOpen ? "opacity-100" : "lg:opacity-0"}
                        `}
                    />
                  )}
                </button>

                {/* Sub Menu Items - Only show when business plan is active and sidebar is open */}
                {hasSubItems && isBusinessPlanActive && isOpen && (
                  <div className="ml-4 pl-3 border-l border-gray-200 dark:border-gray-600 space-y-1">
                    {item.subItems.map((subItem) => {
                      const SubIcon = subItem.icon;
                      const isSubActive = activeSubSection === subItem.id;

                      return (
                        <button
                          key={subItem.id}
                          onClick={(e) => handleSubMenuClick(subItem.id, e)}
                          className={`w-full flex items-center p-2 rounded-lg transition-all duration-200 group text-sm ${
                            isSubActive
                              ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700"
                              : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
                          }`}
                        >
                          <SubIcon
                            size={16}
                            className={`shrink-0 mr-2 ${
                              isSubActive
                                ? "text-blue-600 dark:text-blue-400"
                                : "text-gray-400 dark:text-gray-500"
                            }`}
                          />
                          <span className="text-left truncate">
                            {subItem.label}
                          </span>

                          {/* Active indicator for sub menu */}
                          {isSubActive && (
                            <div className="ml-auto w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* User Info & Logout Section */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-700">
          {/* User Info */}
          <div
            className={`flex items-center mb-4 ${
              !isOpen && "lg:justify-center"
            }`}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-sm">
              {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
            {isOpen && (
              <div className="ml-3 flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {user?.name || "User"}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {user?.email || "user@example.com"}
                </p>
                <p className="text-xs text-green-600 dark:text-green-400 font-medium mt-0.5">
                  {user?.business_name || "Business Owner"}
                </p>
              </div>
            )}

            {/* User Tooltip for collapsed state */}
            {!isOpen && !isMobile && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white dark:text-gray-200 text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
                <div>{user?.name || "User"}</div>
                <div className="text-gray-300 text-xs">
                  {user?.email || "user@example.com"}
                </div>
              </div>
            )}
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className={`w-full flex items-center p-3 rounded-lg transition-all duration-200 group text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 dark:hover:text-red-300 ${
              !isOpen && "lg:justify-center"
            }`}
          >
            <LogOut size={20} className="shrink-0" />

            {/* Logout Text */}
            <span
              className={`
                                font-medium text-left ml-3 
                                transition-all duration-200
                                ${
                                  isOpen
                                    ? "opacity-100 block"
                                    : "lg:opacity-0 lg:absolute lg:-left-96"
                                }
                            `}
            >
              Keluar
            </span>

            {/* Tooltip for collapsed state */}
            {!isOpen && !isMobile && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white dark:text-gray-200 text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
                Keluar
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Toggle Button ketika sidebar tertutup di desktop */}
      {!isOpen && !isMobile && (
        <button
          onClick={onToggle}
          className="fixed top-6 left-6 z-40 p-2 bg-white dark:bg-gray-800 shadow-lg rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors hidden lg:flex items-center justify-center"
          aria-label="Buka sidebar"
        >
          <ChevronRight
            size={20}
            className="text-gray-600 dark:text-gray-300"
          />
        </button>
      )}

      {/* Overlay for mobile */}
      {isOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
    </>
  );
};

export default Sidebar;
