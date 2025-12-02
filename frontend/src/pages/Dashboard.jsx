import { useState, useEffect } from "react";
import Sidebar from "../components/Layout/Sidebar";
import Header from "../components/Layout/Header";
import QuickActions from "../components/Dashboard/QuickActions";
import BusinessPlan from "./BusinessPlan";
import ManagementFinancial from "./ManagementFinancial";
import Forecast from "./Forecast"; // ← NEW: Import Forecast
import Affiliate from "./Affiliate";
import { FileText, BarChart3, TrendingUp } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import UserProfile from "../components/UserProfile/UserProfileView";
import UserProfileEdit from "../components/UserProfile/UserProfileEdit";

const Dashboard = ({ isDarkMode, toggleDarkMode }) => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [activeSubSection, setActiveSubSection] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [page, setPage] = useState("profile");

  const { logout, user } = useAuth();

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  }, [activeSection, activeSubSection, isMobile]);

  useEffect(() => {
    if (!isMobile) {
      setIsSidebarOpen(true);
    }
  }, [isMobile]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  const renderContent = () => {
    // Jika section business-plan aktif, tampilkan BusinessPlan component
    if (activeSection === "business-plan") {
      return (
        <BusinessPlan
          activeSubSection={activeSubSection}
          setActiveSubSection={setActiveSubSection}
        />
      );
    }

    // Jika section management-financial aktif, tampilkan ManagementFinancial component
    if (activeSection === "management-financial") {
      return (
        <ManagementFinancial
          activeSubSection={activeSubSection}
          setActiveSubSection={setActiveSubSection}
        />
      );
    }

    // Jika section forecast aktif, tampilkan Forecast component
    if (activeSection === "forecast") {
      return (
        <Forecast
          activeSubSection={activeSubSection}
          setActiveSubSection={setActiveSubSection}
        />
      );
    }

    // Jika section affiliate aktif, tampilkan Affiliate component
    if (activeSection === "affiliate") {
      return (
        <Affiliate
          activeSubSection={activeSubSection}
          setActiveSubSection={setActiveSubSection}
        />
      );
    }

    // Main section
    switch (activeSection) {
      case "dashboard":
        return (
          <div className="space-y-6">
            {/* Welcome Header */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Dashboard Utama
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Selamat datang kembali! Kelola semua aspek bisnis Anda dari satu tempat.
              </p>
            </div>

            {/* Module Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Business Plan Module */}
              <button
                onClick={() => {
                  setActiveSection("business-plan");
                  setActiveSubSection("business-background");
                }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md hover:scale-105 transition-all duration-200 text-left group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors">
                    <FileText size={20} className="text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded">
                    8 Sub-modul
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  Business Plan
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Buat rencana bisnis profesional
                </p>
              </button>

              {/* Financial Management Module */}
              <button
                onClick={() => {
                  setActiveSection("management-financial");
                  setActiveSubSection("financial-simulation");
                }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md hover:scale-105 transition-all duration-200 text-left group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center group-hover:bg-green-200 dark:group-hover:bg-green-900/50 transition-colors">
                    <BarChart3 size={20} className="text-green-600 dark:text-green-400" />
                  </div>
                  <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded">
                    6 Sub-modul
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  Financial Management
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Kelola keuangan dan laporan
                </p>
              </button>

              {/* Forecast Module */}
              <button
                onClick={() => {
                  setActiveSection("forecast");
                  setActiveSubSection("daftar-forecast");
                }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md hover:scale-105 transition-all duration-200 text-left group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center group-hover:bg-purple-200 dark:group-hover:bg-purple-900/50 transition-colors">
                    <TrendingUp size={20} className="text-purple-600 dark:text-purple-400" />
                  </div>
                  <span className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-1 rounded">
                    2 Modul
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  Forecast Keuangan
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Prediksi masa depan bisnis
                </p>
              </button>

              {/* Affiliate Module */}
              <button
                onClick={() => {
                  setActiveSection("affiliate");
                  setActiveSubSection("affiliate-link");
                }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md hover:scale-105 transition-all duration-200 text-left group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center group-hover:bg-orange-200 dark:group-hover:bg-orange-900/50 transition-colors">
                    <FileText size={20} className="text-orange-600 dark:text-orange-400" />
                  </div>
                  <span className="text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 px-2 py-1 rounded">
                    3 Sub-modul
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  Affiliate & Lead
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Kelola link affiliate
                </p>
              </button>
            </div>

            {/* Recent Plans & Quick Actions */}
            <div className="lg:col-span-2">
              <QuickActions />
            </div>
          </div>
        );

      case "financial":
        return (
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Manajemen Keuangan
            </h1>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
              <FileText
                size={48}
                className="mx-auto text-gray-400 dark:text-gray-500 mb-4"
              />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Modul Manajemen Keuangan
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Fitur ini sedang dalam pengembangan
              </p>
            </div>
          </div>
        );

      case "forecast":
        return (
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Forecast
            </h1>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
              <FileText
                size={48}
                className="mx-auto text-gray-400 dark:text-gray-500 mb-4"
              />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Modul Forecast
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Fitur ini sedang dalam pengembangan
              </p>
            </div>
          </div>
        );

      case "analytics":
        return (
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Analisis & Grafik Bisnis
            </h1>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
              <FileText
                size={48}
                className="mx-auto text-gray-400 dark:text-gray-500 mb-4"
              />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Modul Analisis & Grafik
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Fitur ini sedang dalam pengembangan
              </p>
            </div>
          </div>
        );

      case "profile":
        switch (page) {
          case "profile":
            return <UserProfile onEdit={() => setPage("edit-profile")} />;

          case "edit-profile":
            return <UserProfileEdit onBack={() => setPage("profile")} />;

          default:
            return <UserProfile onEdit={() => setPage("edit-profile")} />;
        }

      default:
        return (
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              {activeSection.charAt(0).toUpperCase() +
                activeSection.slice(1).replace("-", " ")}
            </h1>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
              <FileText
                size={48}
                className="mx-auto text-gray-400 dark:text-gray-500 mb-4"
              />
              <p className="text-gray-600 dark:text-gray-400">
                Fitur ini sedang dalam pengembangan
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        activeSubSection={activeSubSection}
        setActiveSubSection={setActiveSubSection}
        isOpen={isSidebarOpen}
        onToggle={toggleSidebar}
        onClose={closeSidebar}
        isMobile={isMobile}
        isDarkMode={isDarkMode}
        onLogout={handleLogout}
        user={user}
      />

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isSidebarOpen && !isMobile ? "lg:ml-0" : "ml-0"
        }`}
      >
        <Header
          onToggleSidebar={toggleSidebar}
          isMobile={isMobile}
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
          user={user}
        />

        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          <div className="max-w-7xl mx-auto w-full">{renderContent()}</div>
        </main>
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}
    </div>
  );
};

export default Dashboard;