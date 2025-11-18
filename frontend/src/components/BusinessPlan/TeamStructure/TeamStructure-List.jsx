import { Users, Building, Calendar, Plus, Eye, Edit3, Trash2, Loader, RefreshCw, X, User, Briefcase, GraduationCap, Target, CheckCircle, Clock, Image } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'react-toastify';

const TeamStructureList = ({
    teams,
    onView,
    onEdit,
    onDelete,
    onCreateNew,
    isLoading,
    error,
    onRetry,
    statistics
}) => {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [teamToDelete, setTeamToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [selectedBusiness, setSelectedBusiness] = useState('all');
    const [selectedStatus, setSelectedStatus] = useState('all');

    const handleDeleteClick = (teamId, teamName) => {
        setTeamToDelete({ id: teamId, name: teamName });
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        if (!teamToDelete) return;

        setIsDeleting(true);
        try {
            await onDelete(teamToDelete.id);
            toast.success('Anggota tim berhasil dihapus!');
        } catch (error) {
            toast.error('Gagal menghapus anggota tim!');
        } finally {
            setIsDeleting(false);
            setShowDeleteModal(false);
            setTeamToDelete(null);
        }
    };

    const handleCancelDelete = () => {
        setShowDeleteModal(false);
        setTeamToDelete(null);
    };

    // Get unique businesses for filter
    const getUniqueBusinesses = () => {
        const businesses = teams
            .filter(team => {
                return team.business_background &&
                    team.business_background.id &&
                    team.business_background.name;
            })
            .map(team => ({
                id: team.business_background.id,
                name: team.business_background.name,
                category: team.business_background.category || 'Tidak ada kategori'
            }));

        // Remove duplicates
        return businesses.filter((business, index, self) =>
            index === self.findIndex(b => b.id === business.id)
        );
    };

    // Filter teams berdasarkan criteria
    const filteredTeams = teams.filter(team => {
        // Filter business
        if (selectedBusiness !== 'all' && team.business_background?.id !== selectedBusiness) {
            return false;
        }
        
        // Filter status
        if (selectedStatus !== 'all' && team.status !== selectedStatus) {
            return false;
        }
        
        return true;
    });

    const uniqueBusinesses = getUniqueBusinesses();

    // Helper function untuk mengakses business background
    const getBusinessInfo = (team) => {
        if (!team.business_background) {
            return {
                name: `Bisnis (ID: ${team.business_background_id})`,
                category: 'Tidak ada kategori'
            };
        }

        return {
            name: team.business_background.name || `Bisnis (ID: ${team.business_background_id})`,
            category: team.business_background.category || 'Tidak ada kategori'
        };
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            draft: { color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300', label: 'Draft' },
            active: { color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300', label: 'Aktif' }
        };

        const config = statusConfig[status] || statusConfig.draft;
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
                {config.label}
            </span>
        );
    };

    const getTeamCategoryBadge = (category) => {
        const categoryConfig = {
            'tim backend': { color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300' },
            'tim frontend': { color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300' },
            'tim produksi': { color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' },
            'tim marketing': { color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300' },
            'tim operasional': { color: 'bg-teal-100 text-teal-800 dark:bg-teal-900/20 dark:text-teal-300' },
            'tim management': { color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-300' },
        };

        const config = categoryConfig[category?.toLowerCase()] || { color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300' };
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
                {category || 'Tidak ada kategori'}
            </span>
        );
    };

    // Reset semua filter
    const resetFilters = () => {
        setSelectedBusiness('all');
        setSelectedStatus('all');
    };

    // Calculate statistics jika tidak disediakan dari props
    const calculatedStatistics = statistics || {
        total: teams.length,
        active_count: teams.filter(team => team.status === 'active').length,
        draft_count: teams.filter(team => team.status === 'draft').length,
        with_photo_count: teams.filter(team => team.photo_url).length,
        management_count: teams.filter(team => team.team_category?.toLowerCase().includes('management')).length,
        operational_count: teams.filter(team => team.team_category?.toLowerCase().includes('operasional')).length,
        recent_count: teams.filter(team => {
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
            return new Date(team.created_at) > oneWeekAgo;
        }).length
    };

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Struktur Tim</h1>
                        <p className="text-gray-600 dark:text-gray-400">Kelola struktur organisasi dan anggota tim</p>
                    </div>
                </div>
                <div className="flex justify-center items-center h-64">
                    <div className="text-center">
                        <Loader className="animate-spin h-8 w-8 text-indigo-600 mx-auto mb-4" />
                        <p className="text-gray-600 dark:text-gray-400">Memuat data...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Struktur Tim</h1>
                        <p className="text-gray-600 dark:text-gray-400">Kelola struktur organisasi dan anggota tim</p>
                    </div>
                </div>
                <div className="text-center py-12">
                    <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Gagal Memuat Data</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-md mx-auto">
                        {error}
                    </p>
                    <button
                        onClick={onRetry}
                        className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors mx-auto"
                    >
                        <RefreshCw size={16} />
                        Coba Lagi
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Modal Konfirmasi Delete */}
            {showDeleteModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black/40">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.25)] border border-gray-200 dark:border-gray-700 max-w-md w-full p-6 transition-all duration-300">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Konfirmasi Hapus
                            </h3>
                            <button
                                onClick={handleCancelDelete}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="mb-6 text-center">
                            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                                <Trash2 className="w-6 h-6 text-red-600" />
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 mb-2">
                                Apakah Anda yakin ingin menghapus anggota tim ini?
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                <strong>"{teamToDelete?.name}"</strong>
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={handleCancelDelete}
                                disabled={isDeleting}
                                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleConfirmDelete}
                                disabled={isDeleting}
                                className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isDeleting ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        Menghapus...
                                    </>
                                ) : (
                                    <>
                                        <Trash2 size={16} />
                                        Hapus
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* HEADER */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Struktur Tim</h1>
                    <p className="text-gray-600 dark:text-gray-400">Kelola struktur organisasi dan anggota tim</p>
                </div>
                <button
                    onClick={onCreateNew}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 w-full sm:w-auto"
                >
                    <Plus size={20} />
                    Tambah Anggota
                </button>
            </div>

            {/* STATISTICS CARDS - Konsisten dengan yang lain */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Total Anggota Tim
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Total Anggota</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{calculatedStatistics.total || 0}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                Semua anggota tim
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/20 rounded-lg flex items-center justify-center">
                            <Users className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                        </div>
                    </div>
                </div> */}

                {/* Anggota Aktif */}
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Aktif</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{calculatedStatistics.active_count || 0}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {calculatedStatistics.total > 0 ? 
                                    Math.round((calculatedStatistics.active_count / calculatedStatistics.total) * 100) : 0
                                }% dari total
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                            <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                        </div>
                    </div>
                </div>

                {/* Status Draft */}
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Draft</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{calculatedStatistics.draft_count || 0}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                Perlu diselesaikan
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center">
                            <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                        </div>
                    </div>
                </div>

            </div>

            {/* FILTER SECTION - Horizontal konsisten */}
            {(teams.length > 0 || uniqueBusinesses.length > 0) && (
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
                        <h3 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                            <Building size={16} />
                            Filter Berdasarkan Bisnis:
                        </h3>
                        {(selectedBusiness !== 'all' || selectedStatus !== 'all') && (
                            <button
                                onClick={resetFilters}
                                className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200 w-full sm:w-auto text-left sm:text-center"
                            >
                                Reset Filter
                            </button>
                        )}
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                        {/* Tombol Semua Bisnis */}
                        <button
                            onClick={() => setSelectedBusiness('all')}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all duration-200 text-sm ${
                                selectedBusiness === 'all'
                                    ? 'bg-green-500 border-green-500 text-white shadow-sm'
                                    : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                            }`}
                        >
                            <Building size={14} />
                            <span>Semua Bisnis</span>
                            <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                                selectedBusiness === 'all' 
                                    ? 'bg-green-600 text-white' 
                                    : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                            }`}>
                                {teams.length}
                            </span>
                        </button>

                        {/* Tombol untuk setiap bisnis */}
                        {uniqueBusinesses.map(business => (
                            <button
                                key={business.id}
                                onClick={() => setSelectedBusiness(business.id)}
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all duration-200 text-sm ${
                                    selectedBusiness === business.id
                                        ? 'bg-blue-500 border-blue-500 text-white shadow-sm'
                                        : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                                }`}
                            >
                                <Building size={14} />
                                <div className="text-left">
                                    <div className="font-medium">{business.name}</div>
                                    <div className="text-xs opacity-80 hidden sm:block">{business.category}</div>
                                </div>
                                <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                                    selectedBusiness === business.id 
                                        ? 'bg-blue-600 text-white' 
                                        : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                                }`}>
                                    {teams.filter(t => t.business_background?.id === business.id).length}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Status Filter */}
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setSelectedStatus('all')}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all duration-200 text-sm ${
                                selectedStatus === 'all'
                                    ? 'bg-purple-500 border-purple-500 text-white shadow-sm'
                                    : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                            }`}
                        >
                            <User size={14} />
                            <span>Semua Status</span>
                            <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                                selectedStatus === 'all' 
                                    ? 'bg-purple-600 text-white' 
                                    : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                            }`}>
                                {teams.length}
                            </span>
                        </button>

                        <button
                            onClick={() => setSelectedStatus('draft')}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all duration-200 text-sm ${
                                selectedStatus === 'draft'
                                    ? 'bg-yellow-500 border-yellow-500 text-white shadow-sm'
                                    : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                            }`}
                        >
                            <User size={14} />
                            <span>Draft</span>
                            <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                                selectedStatus === 'draft' 
                                    ? 'bg-yellow-600 text-white' 
                                    : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                            }`}>
                                {teams.filter(t => t.status === 'draft').length}
                            </span>
                        </button>

                        <button
                            onClick={() => setSelectedStatus('active')}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all duration-200 text-sm ${
                                selectedStatus === 'active'
                                    ? 'bg-green-500 border-green-500 text-white shadow-sm'
                                    : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                            }`}
                        >
                            <User size={14} />
                            <span>Aktif</span>
                            <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                                selectedStatus === 'active' 
                                    ? 'bg-green-600 text-white' 
                                    : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                            }`}>
                                {teams.filter(t => t.status === 'active').length}
                            </span>
                        </button>
                    </div>

                    {/* Filter Info */}
                    {(selectedBusiness !== 'all' || selectedStatus !== 'all') && (
                        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                <div className="flex items-center gap-2 text-blue-800 dark:text-blue-300 text-sm">
                                    <Building size={16} />
                                    <span>
                                        Menampilkan {filteredTeams.length} dari {teams.length} anggota tim
                                        {selectedBusiness !== 'all' && (
                                            <span> untuk <strong>{uniqueBusinesses.find(b => b.id === selectedBusiness)?.name}</strong></span>
                                        )}
                                        {selectedStatus !== 'all' && (
                                            <span> - Status: <strong>
                                                {selectedStatus === 'draft' ? 'Draft' : 'Aktif'}
                                            </strong></span>
                                        )}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* CARD VIEW */}
            {teams.length === 0 ? (
                <div className="text-center py-12">
                    <Users size={64} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Belum ada struktur tim</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">Mulai dengan menambahkan anggota tim pertama Anda</p>
                    <button
                        onClick={onCreateNew}
                        className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors w-full sm:w-auto"
                    >
                        Tambah Anggota Pertama
                    </button>
                </div>
            ) : filteredTeams.length === 0 ? (
                <div className="text-center py-12">
                    <Building size={64} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Tidak ada anggota tim yang sesuai</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">Tidak ditemukan anggota tim untuk filter yang dipilih</p>
                    <button
                        onClick={resetFilters}
                        className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors w-full sm:w-auto"
                    >
                        Reset Filter
                    </button>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filteredTeams.map((team) => {
                            const businessInfo = getBusinessInfo(team);
                            
                            return (
                                <div key={team.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            {team.photo_url ? (
                                                <img 
                                                    src={team.photo_url} 
                                                    alt={team.member_name}
                                                    className="w-12 h-12 rounded-lg object-cover border border-gray-200 dark:border-gray-600"
                                                />
                                            ) : (
                                                <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/20 rounded-lg flex items-center justify-center border border-indigo-200 dark:border-indigo-800">
                                                    <User className="text-indigo-600 dark:text-indigo-400" size={24} />
                                                </div>
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-1">
                                                    {team.member_name}
                                                </h3>
                                                <div className="flex flex-wrap gap-1 mt-1">
                                                    <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded">
                                                        {businessInfo.category}
                                                    </span>
                                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                                        {new Date(team.created_at).toLocaleDateString('id-ID')}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400 mb-4">
                                        <div className="flex items-start gap-2">
                                            <Briefcase size={16} className="mt-0.5 flex-shrink-0" />
                                            <span className="line-clamp-2">{team.position}</span>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <Users size={16} className="mt-0.5 flex-shrink-0" />
                                            <span className="line-clamp-2">{team.team_category}</span>
                                        </div>
                                        {team.experience && (
                                            <div className="flex items-start gap-2">
                                                <GraduationCap size={16} className="mt-0.5 flex-shrink-0" />
                                                <span className="line-clamp-2">{team.experience.substring(0, 80)}...</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-center justify-between mb-4">
                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                            {businessInfo.name}
                                        </div>
                                        {getStatusBadge(team.status)}
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => onView(team)}
                                            className="flex-1 bg-blue-600 text-white py-2 px-2 rounded text-sm hover:bg-blue-700 transition-colors flex items-center justify-center gap-1"
                                            title="Lihat Detail"
                                        >
                                            <Eye size={14} />
                                            <span className="hidden xs:inline">Lihat</span>
                                        </button>
                                        <button
                                            onClick={() => onEdit(team)}
                                            className="flex-1 bg-yellow-600 text-white py-2 px-2 rounded text-sm hover:bg-yellow-700 transition-colors flex items-center justify-center gap-1"
                                            title="Edit"
                                        >
                                            <Edit3 size={14} />
                                            <span className="hidden xs:inline">Edit</span>
                                        </button>
                                        <button
                                            onClick={() => handleDeleteClick(team.id, team.member_name)}
                                            className="flex-1 bg-red-600 text-white py-2 px-2 rounded text-sm hover:bg-red-700 transition-colors flex items-center justify-center gap-1"
                                            title="Hapus"
                                        >
                                            <Trash2 size={14} />
                                            <span className="hidden xs:inline">Hapus</span>
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Info Jumlah Data */}
                    <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                        Menampilkan {filteredTeams.length} dari {teams.length} anggota tim
                        {(selectedBusiness !== 'all' || selectedStatus !== 'all') && (
                            <span>
                                {selectedBusiness !== 'all' && (
                                    <span> untuk <strong>{uniqueBusinesses.find(b => b.id === selectedBusiness)?.name}</strong></span>
                                )}
                                {selectedStatus !== 'all' && (
                                    <span> - Status: <strong>
                                        {selectedStatus === 'draft' ? 'Draft' : 'Aktif'}
                                    </strong></span>
                                )}
                            </span>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default TeamStructureList;