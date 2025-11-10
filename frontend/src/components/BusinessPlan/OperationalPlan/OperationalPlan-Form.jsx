import { useState } from 'react';
import { Building, Loader, Plus, Trash2, Clock, Users, Truck } from 'lucide-react';

const OperationalPlanForm = ({
    title,
    subtitle,
    formData,
    businesses,
    isLoadingBusinesses,
    isLoading,
    onInputChange,
    onEmployeesChange,
    onOperationalHoursChange,
    onSuppliersChange,
    onSubmit,
    onBack,
    submitButtonText,
    submitButtonIcon,
    mode = 'create'
}) => {
    const [errors, setErrors] = useState({});

    const validateField = (name, value) => {
        const newErrors = { ...errors };
        
        if (name === 'business_location' && !value.trim()) {
            newErrors.business_location = 'Lokasi bisnis wajib diisi';
        } else if (name === 'business_location') {
            delete newErrors.business_location;
        }

        if (name === 'location_type' && !value) {
            newErrors.location_type = 'Tipe lokasi wajib dipilih';
        } else if (name === 'location_type') {
            delete newErrors.location_type;
        }

        if (name === 'daily_workflow' && !value.trim()) {
            newErrors.daily_workflow = 'Alur kerja harian wajib diisi';
        } else if (name === 'daily_workflow') {
            delete newErrors.daily_workflow;
        }

        setErrors(newErrors);
    };

    const handleInputChangeWrapper = (name, value) => {
        onInputChange(name, value);
        validateField(name, value);
    };

    // Employee Functions
    const addEmployee = () => {
        const newEmployees = [...formData.employees, { position: '', quantity: 1, salary: '', responsibilities: '' }];
        onEmployeesChange(newEmployees);
    };

    const updateEmployee = (index, field, value) => {
        const newEmployees = [...formData.employees];
        newEmployees[index][field] = value;
        onEmployeesChange(newEmployees);
    };

    const removeEmployee = (index) => {
        const newEmployees = formData.employees.filter((_, i) => i !== index);
        onEmployeesChange(newEmployees);
    };

    // Operational Hours Functions
    const addOperationalHour = () => {
        const newHours = [...formData.operational_hours, { day: '', open: '09:00', close: '17:00' }];
        onOperationalHoursChange(newHours);
    };

    const updateOperationalHour = (index, field, value) => {
        const newHours = [...formData.operational_hours];
        newHours[index][field] = value;
        onOperationalHoursChange(newHours);
    };

    const removeOperationalHour = (index) => {
        const newHours = formData.operational_hours.filter((_, i) => i !== index);
        onOperationalHoursChange(newHours);
    };

    // Supplier Functions
    const addSupplier = () => {
        const newSuppliers = [...formData.suppliers, { name: '', product: '', contact: '' }];
        onSuppliersChange(newSuppliers);
    };

    const updateSupplier = (index, field, value) => {
        const newSuppliers = [...formData.suppliers];
        newSuppliers[index][field] = value;
        onSuppliersChange(newSuppliers);
    };

    const removeSupplier = (index) => {
        const newSuppliers = formData.suppliers.filter((_, i) => i !== index);
        onSuppliersChange(newSuppliers);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Final validation
        const finalErrors = {};
        if (!formData.business_location.trim()) finalErrors.business_location = 'Lokasi bisnis wajib diisi';
        if (!formData.location_type) finalErrors.location_type = 'Tipe lokasi wajib dipilih';
        if (!formData.daily_workflow.trim()) finalErrors.daily_workflow = 'Alur kerja harian wajib diisi';

        if (Object.keys(finalErrors).length > 0) {
            setErrors(finalErrors);
            return;
        }

        onSubmit(e);
    };

    return (
        <div className="space-y-6">
            {/* Header Section dengan tombol back di atas */}
            <div className="mb-2">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-4"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Kembali
                </button>
                
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>
                    <p className="text-gray-600 dark:text-gray-400">{subtitle}</p>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 space-y-6">
                    
                    {/* Pilih Bisnis */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Pilih Bisnis *
                        </label>
                        {isLoadingBusinesses ? (
                            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                                <Loader className="animate-spin h-4 w-4" />
                                <span>Memuat data bisnis...</span>
                            </div>
                        ) : businesses.length === 0 ? (
                            <div className="text-center py-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                                <Building className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                <p className="text-gray-500 dark:text-gray-400 text-sm">
                                    Belum ada data bisnis. Silakan buat latar belakang bisnis terlebih dahulu.
                                </p>
                            </div>
                        ) : (
                            <select
                                name="business_background_id"
                                value={formData.business_background_id}
                                onChange={(e) => handleInputChangeWrapper('business_background_id', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                required
                            >
                                <option value="">Pilih Bisnis</option>
                                {businesses.map((business) => (
                                    <option key={business.id} value={business.id}>
                                        {business.name} - {business.category}
                                    </option>
                                ))}
                            </select>
                        )}
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Pilih bisnis untuk rencana operasional
                        </p>
                    </div>

                    {/* Lokasi Usaha */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Lokasi Bisnis *
                            </label>
                            <input
                                type="text"
                                name="business_location"
                                value={formData.business_location}
                                onChange={(e) => handleInputChangeWrapper('business_location', e.target.value)}
                                placeholder="Alamat lengkap usaha"
                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                                    errors.business_location ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                }`}
                            />
                            {errors.business_location && (
                                <p className="text-red-500 text-sm mt-1">{errors.business_location}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Tipe Lokasi *
                            </label>
                            <select
                                name="location_type"
                                value={formData.location_type}
                                onChange={(e) => handleInputChangeWrapper('location_type', e.target.value)}
                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                                    errors.location_type ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                }`}
                            >
                                <option value="">Pilih Tipe Lokasi</option>
                                <option value="owned">Milik Sendiri</option>
                                <option value="rented">Sewa</option>
                                <option value="virtual">Virtual/Online</option>
                                <option value="franchise">Waralaba</option>
                            </select>
                            {errors.location_type && (
                                <p className="text-red-500 text-sm mt-1">{errors.location_type}</p>
                            )}
                        </div>
                    </div>

                    {/* Deskripsi Lokasi */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Deskripsi Lokasi
                        </label>
                        <textarea
                            name="location_description"
                            value={formData.location_description}
                            onChange={(e) => handleInputChangeWrapper('location_description', e.target.value)}
                            rows={3}
                            placeholder="Deskripsi detail tentang lokasi usaha..."
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        />
                    </div>

                    {/* Luas dan Biaya Sewa */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Luas Lokasi (m²)
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                name="location_size"
                                value={formData.location_size}
                                onChange={(e) => handleInputChangeWrapper('location_size', e.target.value)}
                                placeholder="0.00"
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Biaya Sewa (Rp)
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                name="rent_cost"
                                value={formData.rent_cost}
                                onChange={(e) => handleInputChangeWrapper('rent_cost', e.target.value)}
                                placeholder="0"
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                            />
                        </div>
                    </div>

                    {/* Karyawan */}
                    <div className="border-t pt-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                                <Users size={20} />
                                Karyawan
                            </h3>
                            <button
                                type="button"
                                onClick={addEmployee}
                                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                            >
                                <Plus size={16} />
                                <span>Tambah Posisi</span>
                            </button>
                        </div>

                        {formData.employees.map((employee, index) => (
                            <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 mb-4 bg-gray-50 dark:bg-gray-700/50">
                                <div className="flex justify-between items-center mb-3">
                                    <h4 className="font-medium text-gray-700 dark:text-gray-300">Posisi #{index + 1}</h4>
                                    <button
                                        type="button"
                                        onClick={() => removeEmployee(index)}
                                        className="text-red-500 hover:text-red-700 dark:hover:text-red-400"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Posisi/Jabatan
                                        </label>
                                        <input
                                            type="text"
                                            value={employee.position}
                                            onChange={(e) => updateEmployee(index, 'position', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-600 dark:text-white"
                                            placeholder="Contoh: Manager, Kasir, dll"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Jumlah
                                        </label>
                                        <input
                                            type="number"
                                            value={employee.quantity}
                                            onChange={(e) => updateEmployee(index, 'quantity', parseInt(e.target.value) || 1)}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-600 dark:text-white"
                                            min="1"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Gaji (Rp)
                                        </label>
                                        <input
                                            type="number"
                                            value={employee.salary}
                                            onChange={(e) => updateEmployee(index, 'salary', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-600 dark:text-white"
                                            placeholder="0"
                                        />
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Tanggung Jawab
                                    </label>
                                    <textarea
                                        value={employee.responsibilities}
                                        onChange={(e) => updateEmployee(index, 'responsibilities', e.target.value)}
                                        rows={2}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-600 dark:text-white"
                                        placeholder="Deskripsi tanggung jawab..."
                                    />
                                </div>
                            </div>
                        ))}

                        {formData.employees.length === 0 && (
                            <p className="text-gray-500 dark:text-gray-400 text-center py-4">Belum ada data karyawan</p>
                        )}
                    </div>

                    {/* Jam Operasional */}
                    <div className="border-t pt-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                                <Clock size={20} />
                                Jam Operasional
                            </h3>
                            <button
                                type="button"
                                onClick={addOperationalHour}
                                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                            >
                                <Plus size={16} />
                                <span>Tambah Hari</span>
                            </button>
                        </div>

                        {formData.operational_hours.map((hour, index) => (
                            <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 mb-4 bg-gray-50 dark:bg-gray-700/50">
                                <div className="flex justify-between items-center mb-3">
                                    <h4 className="font-medium text-gray-700 dark:text-gray-300">Hari #{index + 1}</h4>
                                    <button
                                        type="button"
                                        onClick={() => removeOperationalHour(index)}
                                        className="text-red-500 hover:text-red-700 dark:hover:text-red-400"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Hari
                                        </label>
                                        <select
                                            value={hour.day}
                                            onChange={(e) => updateOperationalHour(index, 'day', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-600 dark:text-white"
                                        >
                                            <option value="">Pilih Hari</option>
                                            <option value="senin">Senin</option>
                                            <option value="selasa">Selasa</option>
                                            <option value="rabu">Rabu</option>
                                            <option value="kamis">Kamis</option>
                                            <option value="jumat">Jumat</option>
                                            <option value="sabtu">Sabtu</option>
                                            <option value="minggu">Minggu</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Buka
                                        </label>
                                        <input
                                            type="time"
                                            value={hour.open}
                                            onChange={(e) => updateOperationalHour(index, 'open', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-600 dark:text-white"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Tutup
                                        </label>
                                        <input
                                            type="time"
                                            value={hour.close}
                                            onChange={(e) => updateOperationalHour(index, 'close', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-600 dark:text-white"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}

                        {formData.operational_hours.length === 0 && (
                            <p className="text-gray-500 dark:text-gray-400 text-center py-4">Belum ada data jam operasional</p>
                        )}
                    </div>

                    {/* Supplier & Mitra Bisnis */}
                    <div className="border-t pt-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                                <Truck size={20} />
                                Supplier & Mitra Bisnis
                            </h3>
                            <button
                                type="button"
                                onClick={addSupplier}
                                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                            >
                                <Plus size={16} />
                                <span>Tambah Supplier</span>
                            </button>
                        </div>

                        {formData.suppliers.map((supplier, index) => (
                            <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 mb-4 bg-gray-50 dark:bg-gray-700/50">
                                <div className="flex justify-between items-center mb-3">
                                    <h4 className="font-medium text-gray-700 dark:text-gray-300">Supplier #{index + 1}</h4>
                                    <button
                                        type="button"
                                        onClick={() => removeSupplier(index)}
                                        className="text-red-500 hover:text-red-700 dark:hover:text-red-400"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Nama Supplier
                                        </label>
                                        <input
                                            type="text"
                                            value={supplier.name}
                                            onChange={(e) => updateSupplier(index, 'name', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-600 dark:text-white"
                                            placeholder="Nama perusahaan supplier"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Produk/Layanan
                                        </label>
                                        <input
                                            type="text"
                                            value={supplier.product}
                                            onChange={(e) => updateSupplier(index, 'product', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-600 dark:text-white"
                                            placeholder="Produk yang disuplai"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Kontak
                                        </label>
                                        <input
                                            type="text"
                                            value={supplier.contact}
                                            onChange={(e) => updateSupplier(index, 'contact', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-600 dark:text-white"
                                            placeholder="Email/Telepon"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}

                        {formData.suppliers.length === 0 && (
                            <p className="text-gray-500 dark:text-gray-400 text-center py-4">Belum ada data supplier</p>
                        )}
                    </div>

                    {/* Alur Kerja & Teknologi */}
                    <div className="border-t pt-6">
                        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Alur Kerja & Teknologi</h3>
                        
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Alur Kerja Harian *
                            </label>
                            <textarea
                                name="daily_workflow"
                                value={formData.daily_workflow}
                                onChange={(e) => handleInputChangeWrapper('daily_workflow', e.target.value)}
                                rows={4}
                                placeholder="Deskripsi alur kerja harian dari buka hingga tutup..."
                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                                    errors.daily_workflow ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                }`}
                            />
                            {errors.daily_workflow && (
                                <p className="text-red-500 text-sm mt-1">{errors.daily_workflow}</p>
                            )}
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Kebutuhan Peralatan
                            </label>
                            <textarea
                                name="equipment_needs"
                                value={formData.equipment_needs}
                                onChange={(e) => handleInputChangeWrapper('equipment_needs', e.target.value)}
                                rows={3}
                                placeholder="Daftar peralatan yang dibutuhkan..."
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Teknologi yang Digunakan
                            </label>
                            <textarea
                                name="technology_stack"
                                value={formData.technology_stack}
                                onChange={(e) => handleInputChangeWrapper('technology_stack', e.target.value)}
                                rows={3}
                                placeholder="Software, hardware, sistem yang digunakan..."
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                            />
                        </div>
                    </div>

                    {/* Status */}
                    <div className="border-t pt-6">
                        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Status</h3>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Status Rencana
                            </label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={(e) => handleInputChangeWrapper('status', e.target.value)}
                                className="w-full md:w-1/3 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                            >
                                <option value="draft">Draft</option>
                                <option value="completed">Selesai</option>
                            </select>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                        <button
                            type="button"
                            onClick={onBack}
                            className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading || isLoadingBusinesses || businesses.length === 0}
                            className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    Menyimpan...
                                </>
                            ) : (
                                <>
                                    {submitButtonIcon}
                                    {submitButtonText}
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default OperationalPlanForm;