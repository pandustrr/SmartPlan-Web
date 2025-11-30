import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Loader,
    AlertCircle,
    Send,
    Phone,
    Mail,
    MapPin,
    Star,
    ArrowRight,
    Package,
    Users,
    TrendingUp,
    Check,
    ChevronDown,
} from "lucide-react";
import { publicAffiliateApi } from "../../services/publicAffiliateApi";
import { toast } from "react-toastify";

const AffiliateLandingPage = () => {
    const { slug } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [businessData, setBusinessData] = useState(null);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        whatsapp: "",
        interest: "",
        notes: "",
    });
    const [formErrors, setFormErrors] = useState({});
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    useEffect(() => {
        // Track click when landing page loads
        trackClick();
        fetchLandingPageData();
    }, [slug]);

    useEffect(() => {
        // Set document title and favicon when business data is loaded
        if (businessData?.business_name) {
            document.title = `SmartPlan - ${businessData.business_name}`;
            
            // Set favicon dynamically
            if (businessData?.logo_url) {
                // Find or create favicon link element
                let faviconLink = document.querySelector("link[rel='icon']");
                
                if (faviconLink) {
                    // Update existing favicon
                    faviconLink.href = businessData.logo_url;
                    faviconLink.type = "image/png";
                } else {
                    // Create new favicon link if it doesn't exist
                    const newFavicon = document.createElement("link");
                    newFavicon.rel = "icon";
                    newFavicon.href = businessData.logo_url;
                    newFavicon.type = "image/png";
                    document.head.appendChild(newFavicon);
                }
            }
        }
    }, [businessData]);

    const trackClick = async () => {
        try {
            await publicAffiliateApi.trackClick(slug);
        } catch (error) {
            console.error("Error tracking click:", error);
        }
    };

    const fetchLandingPageData = async () => {
        try {
            setLoading(true);
            const response = await publicAffiliateApi.getLandingPage(slug);

            if (response.data?.success) {
                setBusinessData(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching landing page:", error);
            toast.error("Link tidak ditemukan atau telah dihapus");
            setTimeout(() => navigate("/"), 3000);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        // Clear error for this field when user starts typing
        if (formErrors[name]) {
            setFormErrors((prev) => ({
                ...prev,
                [name]: "",
            }));
        }
    };

    const validateForm = () => {
        const errors = {};

        if (!formData.name.trim()) {
            errors.name = "Nama wajib diisi";
        }

        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            errors.email = "Format email tidak valid";
        }

        if (!formData.email && !formData.whatsapp) {
            errors.general = "Email atau nomor WhatsApp harus diisi";
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmitLead = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            setSubmitLoading(true);
            const response = await publicAffiliateApi.submitLead(slug, formData);

            if (response.data?.success) {
                setShowSuccessModal(true);
                setFormData({
                    name: "",
                    email: "",
                    whatsapp: "",
                    interest: "",
                    notes: "",
                });

                // Close modal after 3 seconds
                setTimeout(() => setShowSuccessModal(false), 3000);
            }
        } catch (error) {
            const errorMsg = error.response?.data?.message || "Gagal mengirim lead";
            toast.error(errorMsg);
            console.error("Error submitting lead:", error);
        } finally {
            setSubmitLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
                <div className="text-center">
                    <Loader className="w-8 h-8 text-green-600 animate-spin mx-auto mb-2" />
                    <p className="text-gray-600 dark:text-gray-400">Memuat landing page...</p>
                </div>
            </div>
        );
    }

    if (!businessData) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md w-full text-center shadow-lg">
                    <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        Link Tidak Ditemukan
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Link affiliate yang Anda cari tidak tersedia atau telah dihapus.
                    </p>
                    <button
                        onClick={() => navigate("/")}
                        className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors duration-200"
                    >
                        Kembali ke Beranda
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-200">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-green-600 via-green-500 to-blue-600 dark:from-green-800 dark:via-green-700 dark:to-blue-800 text-white py-20 px-4">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-8">
                        {/* Logo Section */}
                        <div className="mb-6 flex justify-center">
                            {businessData.logo_url ? (
                                <div className="flex items-center justify-center overflow-hidden rounded-2xl transition-transform duration-200 hover:scale-105" style={{ maxWidth: "120px", maxHeight: "120px", filter: "drop-shadow(0 20px 25px rgba(0, 0, 0, 0.15)) drop-shadow(0 10px 10px rgba(0, 0, 0, 0.1))" }}>
                                    <img
                                        src={businessData.logo_url}
                                        alt="Logo"
                                        className="max-w-full max-h-full object-contain"
                                        style={{ maxWidth: "100%", maxHeight: "100%", width: "auto", height: "auto" }}
                                        onError={(e) => {
                                            if (e.target) {
                                                e.target.style.display = "none";
                                                if (e.target.nextElementSibling) {
                                                    e.target.nextElementSibling.style.display = "flex";
                                                }
                                            }
                                        }}
                                    />
                                    <div
                                        className="w-24 h-24 flex items-center justify-center bg-gradient-to-br from-green-100 to-blue-100 rounded-2xl hidden"
                                        style={{ display: "none" }}
                                    >
                                        <span className="text-2xl font-bold text-green-600">
                                            {businessData.business_name?.charAt(0) || "K"}
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <div className="w-24 h-24 rounded-3xl flex items-center justify-center" style={{ filter: "drop-shadow(0 20px 25px rgba(0, 0, 0, 0.15)) drop-shadow(0 10px 10px rgba(0, 0, 0, 0.1))", background: "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)" }}>
                                    <span className="text-4xl font-bold text-white">
                                        {businessData.business_name?.charAt(0) || "K"}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Title & Subtitle */}
                        <h1 className="text-4xl md:text-5xl font-bold mb-3">
                            {businessData.business_name}
                        </h1>
                        {businessData.category && (
                            <div className="inline-block px-4 py-1 bg-green-200 dark:bg-green-900 text-green-900 dark:text-green-100 rounded-full text-sm font-medium mb-4">
                                {businessData.category}
                            </div>
                        )}
                        <p className="text-xl text-green-50 mb-4 max-w-2xl mx-auto leading-relaxed">
                            {businessData.description}
                        </p>
                        {businessData.location && (
                            <div className="flex items-center justify-center gap-2 text-green-100">
                                <MapPin className="w-5 h-5" />
                                <span className="text-sm">{businessData.location}</span>
                            </div>
                        )}

                        {/* WhatsApp CTA Button */}
                        {businessData.whatsapp && (
                            <div className="mt-8 flex justify-center">
                                <a
                                    href={`https://wa.me/${businessData.whatsapp.replace(/\D/g, "")}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-3 px-8 py-4 bg-white text-green-600 font-bold rounded-full shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-200 hover:bg-gray-50"
                                >
                                    <Phone className="w-6 h-6" />
                                    <span>Hubungi via WhatsApp</span>
                                    <ArrowRight className="w-5 h-5" />
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-4 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Business Info */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Purpose Section */}
                        {businessData.purpose && (
                            <section className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg p-8 border border-blue-200 dark:border-blue-800">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                    <TrendingUp className="w-6 h-6 text-blue-600" />
                                    Tujuan Bisnis Kami
                                </h2>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                                    {businessData.purpose}
                                </p>
                            </section>
                        )}

                        {/* Products/Services */}
                        {businessData.products && businessData.products.length > 0 && (
                            <section>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                                    <Package className="w-6 h-6 text-green-600" />
                                    Produk & Layanan Unggulan
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {businessData.products.map((product, index) => (
                                        <div
                                            key={index}
                                            className="bg-white dark:bg-gray-800 rounded-lg p-6 border-2 border-green-200 dark:border-green-900 hover:border-green-400 dark:hover:border-green-700 transition-all duration-200 hover:shadow-lg"
                                        >
                                            <div className="flex items-start gap-4">
                                                <div className="w-14 h-14 bg-gradient-to-br from-green-600 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
                                                    <Package className="w-7 h-7 text-white" />
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="font-bold text-gray-900 dark:text-white mb-2 text-lg">
                                                        {product.name}
                                                    </h3>
                                                    {product.description && (
                                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 leading-relaxed">
                                                            {product.description}
                                                        </p>
                                                    )}
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        {product.type && (
                                                            <span className="text-xs inline-block px-3 py-1 bg-green-200 dark:bg-green-900 text-green-900 dark:text-green-100 rounded-full font-medium">
                                                                {product.type}
                                                            </span>
                                                        )}
                                                        {product.price && (
                                                            <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                                                                Rp {product.price.toLocaleString("id-ID")}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Keunggulan / Values */}
                        {businessData.values && businessData.values.length > 0 && (
                            <section>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                                    <Star className="w-6 h-6 text-yellow-600" />
                                    Nilai & Keunggulan Kami
                                </h2>
                                <div className="space-y-3">
                                    {businessData.values.map((value, index) => (
                                        <div
                                            key={index}
                                            className="flex items-start gap-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800 hover:shadow-md transition-shadow duration-200"
                                        >
                                            <div className="w-8 h-8 bg-yellow-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                                <Check className="w-5 h-5 text-white" />
                                            </div>
                                            <p className="text-gray-700 dark:text-gray-300 font-medium leading-relaxed">
                                                {value}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Vision & Mission */}
                        {(businessData.vision || businessData.mission) && (
                            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {businessData.vision && (
                                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-8 border-2 border-purple-200 dark:border-purple-800">
                                        <div className="flex items-center gap-2 mb-4">
                                            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                                                <span className="text-white font-bold">👁️</span>
                                            </div>
                                            <h3 className="font-bold text-purple-900 dark:text-purple-100 text-lg">
                                                Visi Kami
                                            </h3>
                                        </div>
                                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                            {businessData.vision}
                                        </p>
                                    </div>
                                )}
                                {businessData.mission && (
                                    <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg p-8 border-2 border-orange-200 dark:border-orange-800">
                                        <div className="flex items-center gap-2 mb-4">
                                            <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
                                                <span className="text-white font-bold">🎯</span>
                                            </div>
                                            <h3 className="font-bold text-orange-900 dark:text-orange-100 text-lg">
                                                Misi Kami
                                            </h3>
                                        </div>
                                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                            {businessData.mission}
                                        </p>
                                    </div>
                                )}
                            </section>
                        )}

                        {/* Team */}
                        {businessData.team_members && businessData.team_members.length > 0 && (
                            <section>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                                    <Users className="w-6 h-6 text-indigo-600" />
                                    Tim Kami <span className="text-sm font-normal text-gray-500 dark:text-gray-400">({businessData.team_count} anggota)</span>
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {businessData.team_members.map((member, index) => (
                                        <div
                                            key={index}
                                            className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-700 hover:border-indigo-400 dark:hover:border-indigo-600 hover:shadow-lg transition-all duration-200"
                                        >
                                            {member.photo && (
                                                <img
                                                    src={member.photo}
                                                    alt={member.name}
                                                    className="w-full h-48 object-cover bg-gradient-to-br from-gray-200 to-gray-300"
                                                />
                                            )}
                                            <div className="p-5">
                                                <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-1">
                                                    {member.name}
                                                </h3>
                                                {member.position && (
                                                    <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium mb-3">
                                                        {member.position}
                                                    </p>
                                                )}
                                                {member.experience && (
                                                    <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                                                        {member.experience}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Right Column - Lead Form */}
                    <div className="sticky top-4 h-fit">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border-2 border-gray-200 dark:border-gray-700">
                            {/* Form Header */}
                            <div className="bg-gradient-to-r from-green-600 to-blue-600 dark:from-green-700 dark:to-blue-700 text-white p-8">
                                <h3 className="text-2xl font-bold mb-2">
                                    Hubungi Kami Sekarang
                                </h3>
                                <p className="text-green-50 text-sm leading-relaxed">
                                    Dapatkan konsultasi gratis dan informasi lengkap tentang layanan kami
                                </p>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmitLead} className="p-8 space-y-4">
                                {/* Name */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        Nama Lengkap <span className="text-red-600">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="Masukkan nama Anda"
                                        className={`w-full px-4 py-3 rounded-lg border-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 ${formErrors.name
                                            ? "border-red-500 focus:ring-red-500"
                                            : "border-gray-300 dark:border-gray-600"
                                            }`}
                                    />
                                    {formErrors.name && (
                                        <p className="text-red-600 dark:text-red-400 text-xs mt-1 font-medium">
                                            {formErrors.name}
                                        </p>
                                    )}
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="email@example.com"
                                        className={`w-full px-4 py-3 rounded-lg border-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 ${formErrors.email
                                            ? "border-red-500 focus:ring-red-500"
                                            : "border-gray-300 dark:border-gray-600"
                                            }`}
                                    />
                                    {formErrors.email && (
                                        <p className="text-red-600 dark:text-red-400 text-xs mt-1 font-medium">
                                            {formErrors.email}
                                        </p>
                                    )}
                                </div>

                                {/* WhatsApp */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        Nomor WhatsApp
                                    </label>
                                    <input
                                        type="tel"
                                        name="whatsapp"
                                        value={formData.whatsapp}
                                        onChange={handleInputChange}
                                        placeholder="628xxxxxxxxxx"
                                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
                                    />
                                </div>

                                {/* Interest */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        Minat / Kebutuhan
                                    </label>
                                    <textarea
                                        name="interest"
                                        value={formData.interest}
                                        onChange={handleInputChange}
                                        placeholder="Apa yang Anda cari atau butuhkan dari kami?"
                                        rows="2"
                                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 resize-none"
                                    />
                                </div>

                                {/* Notes */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        Catatan Tambahan
                                    </label>
                                    <textarea
                                        name="notes"
                                        value={formData.notes}
                                        onChange={handleInputChange}
                                        placeholder="Informasi atau pertanyaan tambahan..."
                                        rows="2"
                                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 resize-none"
                                    />
                                </div>

                                {/* General Error */}
                                {formErrors.general && (
                                    <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-lg p-4">
                                        <p className="text-red-700 dark:text-red-400 text-sm font-medium">
                                            {formErrors.general}
                                        </p>
                                    </div>
                                )}

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={submitLoading}
                                    className="w-full px-4 py-3 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 dark:from-green-700 dark:to-blue-700 dark:hover:from-green-800 dark:hover:to-blue-800 text-white rounded-lg font-bold transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                                >
                                    {submitLoading ? (
                                        <>
                                            <Loader className="w-4 h-4 animate-spin" />
                                            Mengirim...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-4 h-4" />
                                            Kirim Sekarang
                                        </>
                                    )}
                                </button>

                                <p className="text-xs text-gray-600 dark:text-gray-400 text-center font-medium">
                                    ✓ Kami akan menghubungi Anda dalam 24 jam
                                </p>
                            </form>
                        </div>

                        {/* Contact Info */}
                        {(businessData.whatsapp || businessData.email || businessData.phone) && (
                            <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 p-6 shadow-md">
                                <h4 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                    <Phone className="w-5 h-5 text-green-600" />
                                    Hubungi Kami Langsung via WhatsApp
                                </h4>
                                <div className="space-y-3">
                                    {businessData.whatsapp && (
                                        <a
                                            href={`https://wa.me/${businessData.whatsapp.replace(/\D/g, "")}?text=Halo,%20saya%20tertarik%20dengan%20layanan%20Anda%20dan%20ingin%20berkonsultasi%20lebih%20lanjut.`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/40 transition-all duration-200 border border-green-200 dark:border-green-800 hover:border-green-400 dark:hover:border-green-600"
                                        >
                                            <Phone className="w-5 h-5 text-green-600 flex-shrink-0" />
                                            <div>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">WhatsApp</p>
                                                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                                    {businessData.whatsapp}
                                                </p>
                                            </div>
                                        </a>
                                    )}
                                    {businessData.email && (
                                        <a
                                            href={`https://wa.me/${businessData.whatsapp ? businessData.whatsapp.replace(/\D/g, "") : businessData.phone ? businessData.phone.replace(/\D/g, "") : ""}?text=Halo,%20saya%20tertarik%20dengan%20layanan%20Anda.%20Email%20saya:%20${encodeURIComponent(formData.email || businessData.email)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-all duration-200 border border-blue-200 dark:border-blue-800 hover:border-blue-400 dark:hover:border-blue-600"
                                        >
                                            <Mail className="w-5 h-5 text-blue-600 flex-shrink-0" />
                                            <div>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">Email (via WhatsApp)</p>
                                                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                                    {businessData.email}
                                                </p>
                                            </div>
                                        </a>
                                    )}
                                    {businessData.phone && (
                                        <a
                                            href={`https://wa.me/${businessData.phone.replace(/\D/g, "")}?text=Halo,%20saya%20tertarik%20dengan%20layanan%20Anda%20dan%20ingin%20berkonsultasi%20lebih%20lanjut.`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/40 transition-all duration-200 border border-green-200 dark:border-green-800 hover:border-green-400 dark:hover:border-green-600 group"
                                        >
                                            <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-green-700 transition-colors duration-200">
                                                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                                                </svg>
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Telepon (via WhatsApp)</p>
                                                <p className="text-sm font-bold text-gray-700 dark:text-gray-300">
                                                    {businessData.phone}
                                                </p>
                                            </div>
                                        </a>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Success Modal */}
            {showSuccessModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-8 text-center animate-in fade-in zoom-in duration-300">
                        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Check className="w-8 h-8 text-green-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            Terima Kasih!
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                            Lead Anda telah berhasil dikirim. Tim kami akan segera menghubungi Anda melalui WhatsApp atau email yang Anda berikan.
                        </p>
                        <button
                            onClick={() => setShowSuccessModal(false)}
                            className="w-full px-4 py-3 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 text-white rounded-lg font-bold transition-all duration-200 shadow-md hover:shadow-lg"
                        >
                            Tutup
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AffiliateLandingPage;
