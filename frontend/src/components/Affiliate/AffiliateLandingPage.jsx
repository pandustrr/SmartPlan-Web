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
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-green-600 via-green-500 to-blue-600 dark:from-green-700 dark:to-blue-700 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          {businessData.logo_url && (
            <img
              src={businessData.logo_url}
              alt="Logo"
              className="w-20 h-20 mx-auto mb-4 rounded-lg shadow-lg object-cover"
            />
          )}
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {businessData.business_name}
          </h1>
          <p className="text-xl md:text-2xl text-green-50 mb-2">
            {businessData.tagline}
          </p>
          <p className="text-green-100 max-w-2xl mx-auto">
            {businessData.description}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Business Info */}
          <div className="lg:col-span-2 space-y-8">
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
                      className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 rounded-lg p-6 border border-green-200 dark:border-green-900"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Package className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                            {product.name}
                          </h3>
                          {product.description && (
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {product.description}
                            </p>
                          )}
                          {product.type && (
                            <span className="text-xs inline-block mt-2 px-2 py-1 bg-green-200 dark:bg-green-900 text-green-900 dark:text-green-100 rounded">
                              {product.type}
                            </span>
                          )}
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
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                  Nilai & Keunggulan Kami
                </h2>
                <div className="space-y-3">
                  {businessData.values.map((value, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
                    >
                      <Check className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                      <p className="text-gray-700 dark:text-gray-300">
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
                  <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-6 border border-purple-200 dark:border-purple-800">
                    <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">
                      Visi Kami
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300">
                      {businessData.vision}
                    </p>
                  </div>
                )}
                {businessData.mission && (
                  <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-6 border border-orange-200 dark:border-orange-800">
                    <h3 className="font-semibold text-orange-900 dark:text-orange-100 mb-2">
                      Misi Kami
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300">
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
                  <Users className="w-6 h-6 text-purple-600" />
                  Tim Kami ({businessData.team_count} anggota)
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {businessData.team_members.map((member, index) => (
                    <div
                      key={index}
                      className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-200"
                    >
                      {member.photo && (
                        <img
                          src={member.photo}
                          alt={member.name}
                          className="w-full h-48 object-cover"
                        />
                      )}
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {member.name}
                        </h3>
                        {member.position && (
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {member.position}
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
            <div className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 rounded-lg shadow-xl overflow-hidden border border-green-200 dark:border-green-800">
              {/* Form Header */}
              <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-6">
                <h3 className="text-xl font-bold mb-1">
                  Dapatkan Konsultasi Gratis
                </h3>
                <p className="text-green-50 text-sm">
                  Isi formulir di bawah untuk hubungi kami
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmitLead} className="p-6 space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Nama Lengkap *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Masukkan nama Anda"
                    className={`w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      formErrors.name
                        ? "border-red-500"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                  />
                  {formErrors.name && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="email@example.com"
                    className={`w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      formErrors.email
                        ? "border-red-500"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                  />
                  {formErrors.email && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
                  )}
                </div>

                {/* WhatsApp */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Nomor WhatsApp
                  </label>
                  <input
                    type="tel"
                    name="whatsapp"
                    value={formData.whatsapp}
                    onChange={handleInputChange}
                    placeholder="628xxxxxxxxxx"
                    className={`w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      formErrors.whatsapp
                        ? "border-red-500"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                  />
                </div>

                {/* Interest */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Minat / Kebutuhan
                  </label>
                  <textarea
                    name="interest"
                    value={formData.interest}
                    onChange={handleInputChange}
                    placeholder="Apa yang Anda cari?"
                    rows="2"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Catatan Tambahan
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Informasi tambahan..."
                    rows="2"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                {/* General Error */}
                {formErrors.general && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                    <p className="text-red-600 dark:text-red-400 text-sm">
                      {formErrors.general}
                    </p>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submitLoading}
                  className="w-full px-4 py-3 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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

                <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
                  Kami akan menghubungi Anda dalam 24 jam
                </p>
              </form>
            </div>

            {/* Contact Info */}
            {(businessData.whatsapp || businessData.email || businessData.phone) && (
              <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 space-y-3">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                  Hubungi Kami Langsung
                </h4>
                {businessData.whatsapp && (
                  <a
                    href={`https://wa.me/${businessData.whatsapp.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors duration-200"
                  >
                    <Phone className="w-5 h-5 text-green-600" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {businessData.whatsapp}
                    </span>
                  </a>
                )}
                {businessData.email && (
                  <a
                    href={`mailto:${businessData.email}`}
                    className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors duration-200"
                  >
                    <Mail className="w-5 h-5 text-blue-600" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {businessData.email}
                    </span>
                  </a>
                )}
                {businessData.phone && (
                  <a
                    href={`tel:${businessData.phone}`}
                    className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-colors duration-200"
                  >
                    <Phone className="w-5 h-5 text-purple-600" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {businessData.phone}
                    </span>
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-md w-full p-8 text-center animate-in fade-in zoom-in duration-300">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Terima Kasih!
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Lead Anda telah berhasil dikirim. Tim kami akan segera menghubungi Anda.
            </p>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors duration-200"
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
