import { useState, useEffect } from 'react';
import {
    FileText,
    Workflow,
    Target,
    Users,
    DollarSign,
    BarChart3,
    ArrowLeft
} from 'lucide-react';
import BusinessBackground from '../components/BusinessPlan/BusinessBackground';
import OperationalPlan from '../components/BusinessPlan/OperationalPlan';

const RencanaBisnis = ({ activeSubSection, setActiveSubSection }) => {
    const [view, setView] = useState('main'); // 'main', 'operational-plan'

    // Sync view dengan activeSubSection dari parent
    useEffect(() => {
        if (activeSubSection) {
            setView(activeSubSection);
        } else {
            setView('main');
        }
    }, [activeSubSection]);

    const handleBackToMain = () => {
        setActiveSubSection('');
        setView('main');
    };

    const handleSubSectionClick = (subSectionId) => {
        setActiveSubSection(subSectionId);
        setView(subSectionId);
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
                {/* Rencana Operasional Card */}
                <div
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group hover:border-green-300 dark:hover:border-green-600"
                    onClick={() => handleSubSectionClick('operational-plan')}
                >
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                        <Workflow className="text-green-600 dark:text-green-400" size={24} />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        Rencana Operasional
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                        Kelola lokasi, karyawan, jam operasional, supplier, dan alur kerja
                    </p>
                    <div className="flex items-center text-green-600 dark:text-green-400 text-sm font-medium">
                        <span>Mulai Rencanakan</span>
                        <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
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
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group hover:border-purple-300 dark:hover:border-purple-600">
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                        <Users className="text-purple-600 dark:text-purple-400" size={24} />
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
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group hover:border-yellow-300 dark:hover:border-yellow-600">
                    <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                        <DollarSign className="text-yellow-600 dark:text-yellow-400" size={24} />
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
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group hover:border-red-300 dark:hover:border-red-600">
                    <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                        <BarChart3 className="text-red-600 dark:text-red-400" size={24} />
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

                {/* Executive Summary Card */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group hover:border-indigo-300 dark:hover:border-indigo-600">
                    <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                        <FileText className="text-indigo-600 dark:text-indigo-400" size={24} />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        Ringkasan Eksekutif
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                        Ringkasan lengkap rencana bisnis untuk presentasi
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
                return (
                    <div>
                        <div className="flex items-center gap-4 mb-6">
                            <button
                                onClick={handleBackToMain}
                                className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                            >
                                <ArrowLeft size={20} />
                                Kembali ke Rencana Bisnis
                            </button>
                        </div>
                        <BusinessBackground />
                    </div>
                );

            case 'operational-plan':
                return (
                    <div>
                        <div className="flex items-center gap-4 mb-6">
                            <button
                                onClick={handleBackToMain}
                                className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                            >
                                <ArrowLeft size={20} />
                                Kembali ke Rencana Bisnis
                            </button>
                        </div>
                        <OperationalPlan />
                    </div>
                );

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

export default RencanaBisnis;