import React, { useState, useEffect } from 'react';
import { backgroundApi } from '../../../services/businessPlan/backgroundApi';
import pdfBusinessPlanApi from '../../../services/businessPlan/pdfBusinessPlanApi';

const PdfBusinessPlan = ({ onBack }) => {
  const [businessBackgrounds, setBusinessBackgrounds] = useState([]);
  const [selectedBusiness, setSelectedBusiness] = useState('');
  const [selectedBusinessData, setSelectedBusinessData] = useState(null);
  const [mode, setMode] = useState('free');
  const [loading, setLoading] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [statistics, setStatistics] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [validationErrors, setValidationErrors] = useState([]);

  useEffect(() => {
    loadBusinessBackgrounds();
    loadStatistics();
  }, []);

  useEffect(() => {
    if (selectedBusiness) {
      loadSelectedBusinessData();
    } else {
      setSelectedBusinessData(null);
      setValidationErrors([]);
    }
  }, [selectedBusiness]);

  const loadBusinessBackgrounds = async () => {
    try {
      const response = await backgroundApi.getAll();
      if (response.data.status === 'success') {
        setBusinessBackgrounds(response.data.data);
      }
    } catch (error) {
      console.error('Error loading business backgrounds:', error);
      setMessage({ type: 'error', text: 'Gagal memuat data bisnis' });
    }
  };

  const loadSelectedBusinessData = async () => {
    try {
      const response = await backgroundApi.getById(selectedBusiness);
      if (response.data.status === 'success') {
        setSelectedBusinessData(response.data.data);
      }
    } catch (error) {
      console.error('Error loading selected business data:', error);
    }
  };

  const loadStatistics = async () => {
    try {
      const response = await pdfBusinessPlanApi.getStatistics();
      if (response.data.status === 'success') {
        setStatistics(response.data.data);
      }
    } catch (error) {
      console.error('Error loading statistics:', error);
    }
  };

  const validateBusinessData = () => {
    const errors = [];

    if (!selectedBusinessData) {
      errors.push('Data bisnis tidak ditemukan');
      return errors;
    }

    // Validasi data minimal yang diperlukan
    if (!selectedBusinessData.name) {
      errors.push('Nama bisnis harus diisi');
    }

    if (!selectedBusinessData.description) {
      errors.push('Deskripsi bisnis harus diisi');
    }

    if (!selectedBusinessData.category) {
      errors.push('Kategori bisnis harus diisi');
    }

    return errors;
  };

  const handleGeneratePdf = async (preview = false) => {
    if (!selectedBusiness) {
      setMessage({ type: 'error', text: 'Pilih bisnis terlebih dahulu' });
      return;
    }

    // Validasi data sebelum generate PDF
    const errors = validateBusinessData();
    if (errors.length > 0) {
      setValidationErrors(errors);
      setMessage({ 
        type: 'error', 
        text: 'Data bisnis belum lengkap. Silakan lengkapi data terlebih dahulu.' 
      });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });
    setValidationErrors([]);

    try {
      if (preview) {
        const response = await pdfBusinessPlanApi.previewPdf(selectedBusiness, mode);
        if (response.data.status === 'success') {
          setPreviewData(response.data.data);
          setPreviewOpen(true);
        }
      } else {
        const response = await pdfBusinessPlanApi.generatePdf(selectedBusiness, mode);
        
        // Create blob and download
        const blob = new Blob([response.data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        
        // Extract filename from response headers or use default
        const contentDisposition = response.headers['content-disposition'];
        let filename = 'business-plan.pdf';
        if (contentDisposition) {
          const filenameMatch = contentDisposition.match(/filename="(.+)"/);
          if (filenameMatch) {
            filename = filenameMatch[1];
          }
        }
        
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        setMessage({ type: 'success', text: 'PDF berhasil diunduh' });
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      
      let errorMessage = 'Gagal menghasilkan PDF. ';
      
      if (error.response?.status === 500) {
        errorMessage += 'Server error. Pastikan semua data bisnis sudah lengkap dan valid.';
      } else if (error.response?.data?.message) {
        errorMessage += error.response.data.message;
      } else {
        errorMessage += 'Silakan coba lagi atau hubungi administrator.';
      }
      
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateExecutiveSummary = async () => {
    if (!selectedBusiness) {
      setMessage({ type: 'error', text: 'Pilih bisnis terlebih dahulu' });
      return;
    }

    // Validasi data sebelum generate executive summary
    const errors = validateBusinessData();
    if (errors.length > 0) {
      setValidationErrors(errors);
      setMessage({ 
        type: 'error', 
        text: 'Data bisnis belum lengkap. Silakan lengkapi data terlebih dahulu.' 
      });
      return;
    }

    setLoading(true);
    try {
      const response = await pdfBusinessPlanApi.generateExecutiveSummary(selectedBusiness);
      if (response.data.status === 'success') {
        setPreviewData({
          executive_summary: response.data.data.executive_summary,
          business_name: response.data.data.business_name,
          type: 'executive_summary'
        });
        setPreviewOpen(true);
      }
    } catch (error) {
      console.error('Error generating executive summary:', error);
      setMessage({ type: 'error', text: 'Gagal menghasilkan ringkasan eksekutif' });
    } finally {
      setLoading(false);
    }
  };

  const getBusinessCompletionStatus = () => {
    if (!selectedBusinessData) return 0;

    let completedFields = 0;
    const requiredFields = [
      'name',
      'description', 
      'category',
      'location',
      'business_type'
    ];

    requiredFields.forEach(field => {
      if (selectedBusinessData[field]) completedFields++;
    });

    return Math.round((completedFields / requiredFields.length) * 100);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header dengan Back Button */}
        <div className="mb-8">
          <button 
            onClick={onBack}
            className="mb-4 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
          >
            ← Kembali ke Menu Utama
          </button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            📊 PDF Business Plan
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Generate laporan business plan profesional dalam format PDF
          </p>
        </div>

        {/* Statistics */}
        {statistics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🏢</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {statistics.total_business_plans}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Total Business Plans
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 text-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">📈</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {statistics.pdf_usage?.generated_today || 0}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                PDF Generated Today
              </div>
            </div>
          </div>
        )}

        {/* Message Alert */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === 'error' 
              ? 'bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400'
              : 'bg-green-100 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400'
          }`}>
            {message.text}
          </div>
        )}

        {/* Validation Errors */}
        {validationErrors.length > 0 && (
          <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <h3 className="font-semibold text-yellow-800 dark:text-yellow-400 mb-2">
              ⚠️ Data yang perlu dilengkapi:
            </h3>
            <ul className="list-disc list-inside space-y-1 text-yellow-700 dark:text-yellow-300">
              {validationErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Business Completion Status */}
        {selectedBusinessData && (
          <div className="mb-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Status Kelengkapan Data
              </h3>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {getBusinessCompletionStatus()}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${getBusinessCompletionStatus()}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              {getBusinessCompletionStatus() >= 80 
                ? '✅ Data sudah cukup lengkap untuk generate PDF'
                : '⚠️ Lengkapi data terlebih dahulu untuk hasil yang optimal'}
            </p>
          </div>
        )}

        {/* Main Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Business Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Pilih Bisnis
              </label>
              <select
                value={selectedBusiness}
                onChange={(e) => setSelectedBusiness(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Pilih bisnis...</option>
                {businessBackgrounds.map((business) => (
                  <option key={business.id} value={business.id}>
                    {business.name} - {business.category}
                  </option>
                ))}
              </select>
            </div>

            {/* Mode Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Mode PDF
              </label>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="free">
                  🆓 Gratis - Dengan Watermark
                </option>
                <option value="pro">
                  💎 Pro - Tanpa Watermark
                </option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 mb-6">
            <button
              onClick={() => handleGeneratePdf(true)}
              disabled={loading || !selectedBusiness || getBusinessCompletionStatus() < 50}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              title={getBusinessCompletionStatus() < 50 ? 'Lengkapi data minimal 50% untuk preview' : ''}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
              ) : (
                '👁️ Preview'
              )}
            </button>

            <button
              onClick={() => handleGeneratePdf(false)}
              disabled={loading || !selectedBusiness || getBusinessCompletionStatus() < 80}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              title={getBusinessCompletionStatus() < 80 ? 'Lengkapi data minimal 80% untuk download PDF' : ''}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                '📥 Download PDF'
              )}
            </button>

            <button
              onClick={handleGenerateExecutiveSummary}
              disabled={loading || !selectedBusiness || getBusinessCompletionStatus() < 50}
              className="flex items-center gap-2 px-4 py-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              title={getBusinessCompletionStatus() < 50 ? 'Lengkapi data minimal 50% untuk ringkasan eksekutif' : ''}
            >
              📄 Ringkasan Eksekutif
            </button>
          </div>

          {/* Features Info */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
              ✨ Fitur PDF Business Plan:
            </h3>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <li>• Ringkasan Eksekutif otomatis</li>
              <li>• Analisis pasar dan kompetitor</li>
              <li>• Rencana keuangan lengkap</li>
              <li>• Struktur organisasi</li>
              <li>• Strategi pemasaran dan operasional</li>
              <li>• Format profesional dan rapi</li>
            </ul>
          </div>
        </div>

        {/* Preview Modal */}
        {previewOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Preview - {previewData?.business_name || 'Business Plan'}
                  </h2>
                  <button
                    onClick={() => setPreviewOpen(false)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div className="p-6">
                {previewData?.type === 'executive_summary' ? (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Ringkasan Eksekutif
                    </h3>
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6 border border-gray-200 dark:border-gray-600">
                      <pre className="whitespace-pre-line text-gray-700 dark:text-gray-300 font-sans">
                        {previewData.executive_summary}
                      </pre>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Data Preview untuk PDF
                    </h3>
                    <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                      <p><strong>Filename:</strong> {previewData?.filename}</p>
                      <p>
                        <strong>Mode:</strong> {previewData?.mode === 'free' 
                          ? '🆓 Gratis (Watermark)' 
                          : '💎 Pro (Tanpa Watermark)'}
                      </p>
                      
                      <div className="mt-4">
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                          Data yang akan dimasukkan dalam PDF:
                        </h4>
                        <ul className="space-y-1">
                          <li>• Informasi Bisnis: {previewData?.preview_data?.business_background?.name}</li>
                          <li>• Analisis Pasar: {previewData?.preview_data?.market_analysis ? '✅' : '❌'}</li>
                          <li>• Produk/Layanan: {previewData?.preview_data?.products_services?.length || 0} item</li>
                          <li>• Strategi Pemasaran: {previewData?.preview_data?.marketing_strategies?.length || 0} item</li>
                          <li>• Rencana Operasional: {previewData?.preview_data?.operational_plans?.length || 0} item</li>
                          <li>• Struktur Tim: {previewData?.preview_data?.team_structures?.length || 0} anggota</li>
                          <li>• Rencana Keuangan: {previewData?.preview_data?.financial_plans?.length || 0} plan</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
                <button
                  onClick={() => setPreviewOpen(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  Tutup
                </button>
                {previewData?.type !== 'executive_summary' && (
                  <button
                    onClick={() => {
                      setPreviewOpen(false);
                      handleGeneratePdf(false);
                    }}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
                  >
                    Download PDF
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PdfBusinessPlan;