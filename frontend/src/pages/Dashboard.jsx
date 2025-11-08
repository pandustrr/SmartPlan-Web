import { useState, useEffect } from 'react'
import Sidebar from '../components/Layout/Sidebar'
import Header from '../components/Layout/Header'
import StatCards from '../components/Dashboard/StatCards'
import RecentPlans from '../components/Dashboard/RecentPlans'
import QuickActions from '../components/Dashboard/QuickActions'
import RencanaBisnis from './RencanaBisnis'
import { FileText } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const Dashboard = ({ isDarkMode, toggleDarkMode }) => {
    const [activeSection, setActiveSection] = useState('dashboard')
    const [activeSubSection, setActiveSubSection] = useState('') // Untuk sub menu
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [isMobile, setIsMobile] = useState(false)

    const { logout, user } = useAuth()

    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth < 1024)
        }

        checkScreenSize()
        window.addEventListener('resize', checkScreenSize)

        return () => window.removeEventListener('resize', checkScreenSize)
    }, [])

    useEffect(() => {
        if (isMobile) {
            setIsSidebarOpen(false)
        }
    }, [activeSection, activeSubSection, isMobile])

    useEffect(() => {
        if (!isMobile) {
            setIsSidebarOpen(true)
        }
    }, [isMobile])

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen)
    }

    const closeSidebar = () => {
        if (isMobile) {
            setIsSidebarOpen(false)
        }
    }

    const handleLogout = () => {
        logout()
    }

    const renderContent = () => {
        // Jika ada sub section aktif, tampilkan RencanaBisnis dengan sub section
        if (activeSubSection) {
            return (
                <RencanaBisnis 
                    activeSubSection={activeSubSection}
                    setActiveSubSection={setActiveSubSection}
                />
            )
        }

        // Main section
        switch (activeSection) {
            case 'dashboard':
                return (
                    <div className="space-y-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                Dashboard Utama
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400">
                                Selamat datang! Lihat ringkasan bisnis Anda.
                            </p>
                        </div>

                        <StatCards />
                        <RecentPlans />
                        <QuickActions />
                    </div>
                )

            case 'business-plan':
                return (
                    <RencanaBisnis 
                        activeSubSection={activeSubSection}
                        setActiveSubSection={setActiveSubSection}
                    />
                )

            case 'financial':
                return (
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                            Manajemen Keuangan
                        </h1>
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
                            <FileText size={48} className="mx-auto text-gray-400 dark:text-gray-500 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                Modul Manajemen Keuangan
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                                Fitur ini sedang dalam pengembangan
                            </p>
                        </div>
                    </div>
                )

            case 'forecast':
                return (
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                            Forecast
                        </h1>
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
                            <FileText size={48} className="mx-auto text-gray-400 dark:text-gray-500 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                Modul Forecast
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                                Fitur ini sedang dalam pengembangan
                            </p>
                        </div>
                    </div>
                )

            case 'analytics':
                return (
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                            Analisis & Grafik Bisnis
                        </h1>
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
                            <FileText size={48} className="mx-auto text-gray-400 dark:text-gray-500 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                Modul Analisis & Grafik
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                                Fitur ini sedang dalam pengembangan
                            </p>
                        </div>
                    </div>
                )

            case 'profile':
                return (
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                            Profil Pengguna
                        </h1>
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
                            <FileText size={48} className="mx-auto text-gray-400 dark:text-gray-500 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                Modul Profil Pengguna
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                                Fitur ini sedang dalam pengembangan
                            </p>
                        </div>
                    </div>
                )

            default:
                return (
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                            {activeSection.charAt(0).toUpperCase() + activeSection.slice(1).replace('-', ' ')}
                        </h1>
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
                            <FileText size={48} className="mx-auto text-gray-400 dark:text-gray-500 mb-4" />
                            <p className="text-gray-600 dark:text-gray-400">
                                Fitur ini sedang dalam pengembangan
                            </p>
                        </div>
                    </div>
                )
        }
    }

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
            <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen && !isMobile ? 'lg:ml-0' : 'ml-0'
                }`}>
                <Header
                    onToggleSidebar={toggleSidebar}
                    isMobile={isMobile}
                    isDarkMode={isDarkMode}
                    toggleDarkMode={toggleDarkMode}
                    user={user}
                />

                <main className="flex-1 p-4 lg:p-6 overflow-auto">
                    <div className="max-w-7xl mx-auto w-full">
                        {renderContent()}
                    </div>
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
    )
}

export default Dashboard