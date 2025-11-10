import { useState, useEffect } from "react";
import {
  FileText,
  Workflow,
  Target,
  Users,
  DollarSign,
  BarChart3,
  Building,
  Package,
} from "lucide-react";
import Background from "../components/BusinessPlan/BusinessBackground/Background";
import MarketAnalysis from "../components/BusinessPlan/MarketAnalysis/MarketAnalysis";
import ProductService from "../components/BusinessPlan/ProductService/ProductService";
import MarketingStrategies from "../components/BusinessPlan/MarketingStrategies/MarketingStrategies";
import OperationalPlan from '../components/BusinessPlan/OperationalPlan/OperationalPlan';

const BusinessPlan = ({ activeSubSection, setActiveSubSection }) => {
  const [view, setView] = useState("main");

  // Sync view dengan activeSubSection dari parent
  useEffect(() => {
    if (activeSubSection) {
      setView(activeSubSection);
    } else {
      setView("main");
    }
  }, [activeSubSection]);

  const handleSubSectionClick = (subSectionId) => {
    setActiveSubSection(subSectionId);
    setView(subSectionId);
  };
  
  const handleBackToMain = () => {
      setActiveSubSection('');
      setView('main');
  };

  const renderMainView = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Rencana Bisnis
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Kelola semua aspek rencana bisnis Anda di satu tempat
        </p>
      </div>
    
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Latar Belakang Bisnis Card */}
        <div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group hover:border-green-300 dark:hover:border-green-600"
          onClick={() => handleSubSectionClick("business-background")}
        >
          <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
            <Building
              className="text-green-600 dark:text-green-400"
              size={24}
            />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Latar Belakang Bisnis
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
            Kelola informasi dasar bisnis, visi, misi, dan nilai-nilai
            perusahaan
          </p>
          <div className="flex items-center text-green-600 dark:text-green-400 text-sm font-medium">
            <span>Kelola Bisnis</span>
            <svg
              className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>

        {/* Analisis Pasar Card */}
        <div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group hover:border-purple-300 dark:hover:border-purple-600"
          onClick={() => handleSubSectionClick("market-analysis")}
        >
          <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
            <BarChart3
              className="text-purple-600 dark:text-purple-400"
              size={24}
            />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Analisis Pasar
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
            Analisis target pasar, kompetitor, dan keunggulan kompetitif
          </p>
          <div className="flex items-center text-purple-600 dark:text-purple-400 text-sm font-medium">
            <span>Kelola Analisis</span>
            <svg
              className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>

        {/* Produk & Layanan Card */}
        <div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group hover:border-orange-300 dark:hover:border-orange-600"
          onClick={() => handleSubSectionClick("product-service")}
        >
          <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
            <Package
              className="text-orange-600 dark:text-orange-400"
              size={24}
            />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Produk & Layanan
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
            Kelola produk, layanan, harga, dan strategi pengembangan
          </p>
          <div className="flex items-center text-orange-600 dark:text-orange-400 text-sm font-medium">
            <span>Kelola Produk/Layanan</span>
            <svg
              className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>

        {/* Rencana Pemasaran Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group hover:border-blue-300 dark:hover:border-blue-600">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
            <Target className="text-blue-600 dark:text-blue-400" size={24} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Rencana Pemasaran
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
            Strategi pemasaran, target pasar, dan kampanye promosi
          </p>
          <div className="text-gray-400 dark:text-gray-500 text-sm">
            Segera Hadir
          </div>
        </div>

        {/* Analisis Kompetitor Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group hover:border-yellow-300 dark:hover:border-yellow-600">
          <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
            <Users className="text-yellow-600 dark:text-yellow-400" size={24} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Analisis Kompetitor
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
            Analisis pesaing dan positioning strategi bisnis
          </p>
          <div className="text-gray-400 dark:text-gray-500 text-sm">
            Segera Hadir
          </div>
        </div>

        {/* Rencana Keuangan Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group hover:border-red-300 dark:hover:border-red-600">
          <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
            <DollarSign className="text-red-600 dark:text-red-400" size={24} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Rencana Keuangan
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
            Proyeksi keuangan, arus kas, dan analisis break-even
          </p>
          <div className="text-gray-400 dark:text-gray-500 text-sm">
            Segera Hadir
          </div>
        </div>

        {/* SWOT Analysis Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group hover:border-indigo-300 dark:hover:border-indigo-600">
          <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
            <FileText
              className="text-indigo-600 dark:text-indigo-400"
              size={24}
            />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Analisis SWOT
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
            Identifikasi Strength, Weakness, Opportunity, Threat
          </p>
          <div className="text-gray-400 dark:text-gray-500 text-sm">
            Segera Hadir
          </div>
        </div>

        {/* Rencana Operasional Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group hover:border-teal-300 dark:hover:border-teal-600">
          <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
            <Workflow className="text-teal-600 dark:text-teal-400" size={24} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Rencana Operasional
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
            Proses bisnis, alur kerja, dan manajemen operasional
          </p>
          <div className="text-gray-400 dark:text-gray-500 text-sm">
            Segera Hadir
          </div>
        </div>
      </div>
    </div>
  );

    const renderSubSection = () => {
        switch (view) {
            case 'business-background':
                return <Background onBack={handleBackToMain} />;
            case 'market-analysis':
                return <MarketAnalysis onBack={handleBackToMain} />;
            case 'product-service':
                return <ProductService onBack={handleBackToMain} />;
            case 'operational-plan':
                return <OperationalPlan onBack={handleBackToMain} />;
            case 'marketing-strategies':
                return <MarketingStrategies onBack={handleBackToMain}/>    
            default:
                return renderMainView();
        }
    };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {renderSubSection()}
      </div>
    </div>
  );
};

export default BusinessPlan;
