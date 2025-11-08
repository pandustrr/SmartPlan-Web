import { useState, useEffect } from 'react';
import { 
    Save, 
    Edit3, 
    Building, 
    MapPin, 
    Calendar, 
    Users, 
    Target,
    Eye,
    Plus,
    Trash2,
    Upload,
    X
} from 'lucide-react';

const BusinessBackground = () => {
    const [businesses, setBusinesses] = useState([]);
    const [currentBusiness, setCurrentBusiness] = useState(null);
    const [view, setView] = useState('list'); // 'list', 'create', 'edit', 'view'
    const [isLoading, setIsLoading] = useState(false);
    const [logoPreview, setLogoPreview] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        category: '',
        description: '',
        purpose: '',
        location: '',
        business_type: '',
        start_date: '',
        values: '',
        vision: '',
        mission: '',
        contact: '',
        logo: null
    });

    // Fetch semua business backgrounds
    const fetchBusinesses = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/business', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            if (data.status === 'success') {
                setBusinesses(data.data);
            }
        } catch (error) {
            console.error('Error fetching businesses:', error);
        }
    };

    useEffect(() => {
        fetchBusinesses();
    }, []);

    const resetForm = () => {
        setFormData({
            name: '',
            category: '',
            description: '',
            purpose: '',
            location: '',
            business_type: '',
            start_date: '',
            values: '',
            vision: '',
            mission: '',
            contact: '',
            logo: null
        });
        setLogoPreview(null);
        setCurrentBusiness(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, logo: file }));
            
            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => {
                setLogoPreview(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeLogo = () => {
        setFormData(prev => ({ ...prev, logo: null }));
        setLogoPreview(null);
    };

    // CREATE
    const handleCreate = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const submitData = new FormData();
            submitData.append('user_id', JSON.parse(localStorage.getItem('user')).id);
            submitData.append('name', formData.name);
            submitData.append('category', formData.category);
            submitData.append('description', formData.description);
            submitData.append('purpose', formData.purpose);
            submitData.append('location', formData.location);
            submitData.append('business_type', formData.business_type);
            submitData.append('start_date', formData.start_date);
            submitData.append('values', formData.values);
            submitData.append('vision', formData.vision);
            submitData.append('mission', formData.mission);
            submitData.append('contact', formData.contact);
            
            if (formData.logo) {
                submitData.append('logo', formData.logo);
            }

            const response = await fetch('http://localhost:8000/api/business', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    // Don't set Content-Type for FormData
                },
                body: submitData
            });

            const data = await response.json();

            if (data.status === 'success') {
                alert('Data bisnis berhasil dibuat!');
                setView('list');
                resetForm();
                fetchBusinesses();
            } else {
                alert('Error: ' + (data.message || 'Terjadi kesalahan'));
            }
        } catch (error) {
            console.error('Error creating business:', error);
            alert('Terjadi kesalahan saat membuat data bisnis');
        } finally {
            setIsLoading(false);
        }
    };

    // UPDATE
    const handleUpdate = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const submitData = new FormData();
            submitData.append('user_id', JSON.parse(localStorage.getItem('user')).id);
            submitData.append('name', formData.name);
            submitData.append('category', formData.category);
            submitData.append('description', formData.description);
            submitData.append('purpose', formData.purpose);
            submitData.append('location', formData.location);
            submitData.append('business_type', formData.business_type);
            submitData.append('start_date', formData.start_date);
            submitData.append('values', formData.values);
            submitData.append('vision', formData.vision);
            submitData.append('mission', formData.mission);
            submitData.append('contact', formData.contact);
            
            if (formData.logo) {
                submitData.append('logo', formData.logo);
            }

            const response = await fetch(`http://localhost:8000/api/business/${currentBusiness.id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: submitData
            });

            const data = await response.json();

            if (data.status === 'success') {
                alert('Data bisnis berhasil diperbarui!');
                setView('list');
                resetForm();
                fetchBusinesses();
            } else {
                alert('Error: ' + (data.message || 'Terjadi kesalahan'));
            }
        } catch (error) {
            console.error('Error updating business:', error);
            alert('Terjadi kesalahan saat memperbarui data bisnis');
        } finally {
            setIsLoading(false);
        }
    };

    // DELETE
    const handleDelete = async (businessId) => {
        if (!confirm('Apakah Anda yakin ingin menghapus data bisnis ini?')) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:8000/api/business/${businessId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (data.status === 'success') {
                alert('Data bisnis berhasil dihapus!');
                fetchBusinesses();
            } else {
                alert('Error: ' + data.message);
            }
        } catch (error) {
            console.error('Error deleting business:', error);
            alert('Terjadi kesalahan saat menghapus data bisnis');
        }
    };

    // VIEW
    const handleView = (business) => {
        setCurrentBusiness(business);
        setFormData({
            name: business.name,
            category: business.category,
            description: business.description,
            purpose: business.purpose,
            location: business.location,
            business_type: business.business_type,
            start_date: business.start_date,
            values: business.values,
            vision: business.vision,
            mission: business.mission,
            contact: business.contact,
            logo: null
        });
        if (business.logo) {
            setLogoPreview(`http://localhost:8000/storage/${business.logo}`);
        }
        setView('view');
    };

    // EDIT
    const handleEdit = (business) => {
        setCurrentBusiness(business);
        setFormData({
            name: business.name,
            category: business.category,
            description: business.description,
            purpose: business.purpose,
            location: business.location,
            business_type: business.business_type,
            start_date: business.start_date,
            values: business.values,
            vision: business.vision,
            mission: business.mission,
            contact: business.contact,
            logo: null
        });
        if (business.logo) {
            setLogoPreview(`http://localhost:8000/storage/${business.logo}`);
        }
        setView('edit');
    };

    // CREATE NEW
    const handleCreateNew = () => {
        setCurrentBusiness(null);
        resetForm();
        setView('create');
    };

    // Render different views
    const renderListView = () => (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Latar Belakang Bisnis</h1>
                    <p className="text-gray-600 dark:text-gray-400">Kelola informasi dasar bisnis Anda</p>
                </div>
                <button
                    onClick={handleCreateNew}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                    <Plus size={20} />
                    Tambah Bisnis
                </button>
            </div>

            {businesses.length === 0 ? (
                <div className="text-center py-12">
                    <Building size={64} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Belum ada data bisnis</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">Mulai dengan menambahkan data bisnis pertama Anda</p>
                    <button
                        onClick={handleCreateNew}
                        className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                    >
                        Tambah Bisnis Pertama
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {businesses.map((business) => (
                        <div key={business.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    {business.logo ? (
                                        <img 
                                            src={`http://localhost:8000/storage/${business.logo}`} 
                                            alt={business.name}
                                            className="w-12 h-12 rounded-lg object-cover"
                                        />
                                    ) : (
                                        <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                                            <Building className="text-green-600 dark:text-green-400" size={24} />
                                        </div>
                                    )}
                                    <div>
                                        <h3 className="font-semibold text-gray-900 dark:text-white">{business.name}</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{business.category}</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
                                <div className="flex items-center gap-2">
                                    <MapPin size={16} />
                                    <span>{business.location}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Building size={16} />
                                    <span>{business.business_type}</span>
                                </div>
                                {business.start_date && (
                                    <div className="flex items-center gap-2">
                                        <Calendar size={16} />
                                        <span>{new Date(business.start_date).toLocaleDateString('id-ID')}</span>
                                    </div>
                                )}
                            </div>

                            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4">
                                {business.description}
                            </p>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleView(business)}
                                    className="flex-1 bg-blue-600 text-white py-2 px-3 rounded text-sm hover:bg-blue-700 transition-colors flex items-center justify-center gap-1"
                                >
                                    <Eye size={16} />
                                    Lihat
                                </button>
                                <button
                                    onClick={() => handleEdit(business)}
                                    className="flex-1 bg-yellow-600 text-white py-2 px-3 rounded text-sm hover:bg-yellow-700 transition-colors flex items-center justify-center gap-1"
                                >
                                    <Edit3 size={16} />
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(business.id)}
                                    className="flex-1 bg-red-600 text-white py-2 px-3 rounded text-sm hover:bg-red-700 transition-colors flex items-center justify-center gap-1"
                                >
                                    <Trash2 size={16} />
                                    Hapus
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    const renderFormView = () => (
        <div className="space-y-6">
            <div className="flex items-center gap-4 mb-6">
                <button
                    onClick={() => setView('list')}
                    className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Kembali ke Daftar
                </button>
                <div className="flex-1">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {view === 'create' ? 'Tambah Bisnis Baru' : 
                         view === 'edit' ? 'Edit Data Bisnis' : 'Detail Bisnis'}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        {view === 'create' ? 'Isi formulir untuk menambahkan bisnis baru' :
                         view === 'edit' ? 'Perbarui informasi bisnis' : 
                         'Lihat detail lengkap bisnis'}
                    </p>
                </div>
                {view === 'view' && (
                    <button
                        onClick={() => handleEdit(currentBusiness)}
                        className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors flex items-center gap-2"
                    >
                        <Edit3 size={16} />
                        Edit
                    </button>
                )}
            </div>

            <form onSubmit={view === 'create' ? handleCreate : handleUpdate}>
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 space-y-6">
                    
                    {/* Logo Upload */}
                    <div className="flex items-start gap-6">
                        <div className="flex-shrink-0">
                            <div className="w-24 h-24 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center bg-gray-50 dark:bg-gray-700/50">
                                {logoPreview ? (
                                    <div className="relative">
                                        <img 
                                            src={logoPreview} 
                                            alt="Logo preview" 
                                            className="w-20 h-20 rounded-lg object-cover"
                                        />
                                        {view !== 'view' && (
                                            <button
                                                type="button"
                                                onClick={removeLogo}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                                            >
                                                <X size={12} />
                                            </button>
                                        )}
                                    </div>
                                ) : (
                                    <Upload className="text-gray-400" size={24} />
                                )}
                            </div>
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Logo Bisnis
                            </label>
                            {view !== 'view' ? (
                                <div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Format: JPG, PNG, GIF (Maks. 2MB)</p>
                                </div>
                            ) : (
                                <p className="text-gray-500 dark:text-gray-400">-</p>
                            )}
                        </div>
                    </div>

                    {/* Basic Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Nama Bisnis *
                            </label>
                            {view === 'view' ? (
                                <p className="text-gray-900 dark:text-white">{formData.name}</p>
                            ) : (
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="Nama perusahaan/usaha"
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                    required
                                />
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Kategori Bisnis *
                            </label>
                            {view === 'view' ? (
                                <p className="text-gray-900 dark:text-white">{formData.category}</p>
                            ) : (
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                    required
                                >
                                    <option value="">Pilih Kategori</option>
                                    <option value="Retail">Retail</option>
                                    <option value="Manufacturing">Manufacturing</option>
                                    <option value="Services">Services</option>
                                    <option value="Technology">Technology</option>
                                    <option value="Food & Beverage">Food & Beverage</option>
                                    <option value="Healthcare">Healthcare</option>
                                    <option value="Education">Education</option>
                                    <option value="Other">Lainnya</option>
                                </select>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Deskripsi Bisnis *
                        </label>
                        {view === 'view' ? (
                            <p className="text-gray-900 dark:text-white whitespace-pre-line">{formData.description}</p>
                        ) : (
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows={4}
                                placeholder="Jelaskan secara detail tentang bisnis Anda, produk/layanan yang ditawarkan, dll."
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                required
                            />
                        )}
                    </div>

                    {/* Location & Type */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Lokasi *
                            </label>
                            {view === 'view' ? (
                                <p className="text-gray-900 dark:text-white">{formData.location}</p>
                            ) : (
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleInputChange}
                                    placeholder="Alamat lengkap bisnis"
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                    required
                                />
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Tipe Bisnis *
                            </label>
                            {view === 'view' ? (
                                <p className="text-gray-900 dark:text-white">{formData.business_type}</p>
                            ) : (
                                <select
                                    name="business_type"
                                    value={formData.business_type}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                    required
                                >
                                    <option value="">Pilih Tipe Bisnis</option>
                                    <option value="PT">PT (Perseroan Terbatas)</option>
                                    <option value="CV">CV (Commanditaire Vennootschap)</option>
                                    <option value="UD">UD (Usaha Dagang)</option>
                                    <option value="Firma">Firma</option>
                                    <option value="UMKM">UMKM</option>
                                    <option value="Startup">Startup</option>
                                    <option value="Freelance">Freelance</option>
                                    <option value="Other">Lainnya</option>
                                </select>
                            )}
                        </div>
                    </div>

                    {/* Additional Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Tanggal Mulai
                            </label>
                            {view === 'view' ? (
                                <p className="text-gray-900 dark:text-white">
                                    {formData.start_date ? new Date(formData.start_date).toLocaleDateString('id-ID') : '-'}
                                </p>
                            ) : (
                                <input
                                    type="date"
                                    name="start_date"
                                    value={formData.start_date}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                />
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Kontak
                            </label>
                            {view === 'view' ? (
                                <p className="text-gray-900 dark:text-white">{formData.contact || '-'}</p>
                            ) : (
                                <input
                                    type="text"
                                    name="contact"
                                    value={formData.contact}
                                    onChange={handleInputChange}
                                    placeholder="Email/Telepon/Media Sosial"
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                />
                            )}
                        </div>
                    </div>

                    {/* Purpose */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Tujuan Bisnis
                        </label>
                        {view === 'view' ? (
                            <p className="text-gray-900 dark:text-white whitespace-pre-line">{formData.purpose || '-'}</p>
                        ) : (
                            <textarea
                                name="purpose"
                                value={formData.purpose}
                                onChange={handleInputChange}
                                rows={3}
                                placeholder="Apa tujuan utama dari bisnis Anda?"
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                            />
                        )}
                    </div>

                    {/* Vision & Mission */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Visi
                            </label>
                            {view === 'view' ? (
                                <p className="text-gray-900 dark:text-white whitespace-pre-line">{formData.vision || '-'}</p>
                            ) : (
                                <textarea
                                    name="vision"
                                    value={formData.vision}
                                    onChange={handleInputChange}
                                    rows={4}
                                    placeholder="Visi jangka panjang bisnis Anda"
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                />
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Misi
                            </label>
                            {view === 'view' ? (
                                <p className="text-gray-900 dark:text-white whitespace-pre-line">{formData.mission || '-'}</p>
                            ) : (
                                <textarea
                                    name="mission"
                                    value={formData.mission}
                                    onChange={handleInputChange}
                                    rows={4}
                                    placeholder="Misi dan langkah-langkah untuk mencapai visi"
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                />
                            )}
                        </div>
                    </div>

                    {/* Values */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Nilai-Nilai Perusahaan
                        </label>
                        {view === 'view' ? (
                            <p className="text-gray-900 dark:text-white whitespace-pre-line">{formData.values || '-'}</p>
                        ) : (
                            <textarea
                                name="values"
                                value={formData.values}
                                onChange={handleInputChange}
                                rows={3}
                                placeholder="Nilai-nilai dan prinsip yang dianut perusahaan"
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                            />
                        )}
                    </div>

                    {/* Action Buttons */}
                    {view !== 'view' && (
                        <div className="flex gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                            <button
                                type="button"
                                onClick={() => setView('list')}
                                className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        Menyimpan...
                                    </>
                                ) : (
                                    <>
                                        <Save size={16} />
                                        {view === 'create' ? 'Simpan Bisnis' : 'Perbarui Bisnis'}
                                    </>
                                )}
                            </button>
                        </div>
                    )}

                    {/* Action Buttons for view mode */}
                    {view === 'view' && (
                        <div className="flex gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                            <button
                                type="button"
                                onClick={() => setView('list')}
                                className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                                Kembali ke Daftar
                            </button>
                            <button
                                type="button"
                                onClick={() => handleEdit(currentBusiness)}
                                className="flex-1 bg-yellow-600 text-white py-3 rounded-lg hover:bg-yellow-700 transition-colors flex items-center justify-center gap-2"
                            >
                                <Edit3 size={16} />
                                Edit Bisnis
                            </button>
                        </div>
                    )}
                </div>
            </form>
        </div>
    );

    // Main render function
    const renderContent = () => {
        switch (view) {
            case 'list':
                return renderListView();
            case 'create':
            case 'edit':
            case 'view':
                return renderFormView();
            default:
                return renderListView();
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-6">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {renderContent()}
            </div>
        </div>
    );
};

export default BusinessBackground;