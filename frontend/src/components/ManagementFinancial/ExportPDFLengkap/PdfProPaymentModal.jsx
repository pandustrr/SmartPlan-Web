import { useState, useEffect } from "react";
import { FiX, FiCreditCard, FiCheck, FiCopy, FiClock, FiAlertCircle, FiCheckCircle } from "react-icons/fi";
import { toast } from "react-hot-toast";
import singapayApi from "../../../services/singapayApi";

const PdfProPaymentModal = ({ isOpen, onClose, onSuccess }) => {
    const [step, setStep] = useState(1); // 1: Package, 2: Payment Method, 3: Payment Info
    const [loading, setLoading] = useState(false);
    const [packages, setPackages] = useState([]);
    const [selectedPackage, setSelectedPackage] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState("virtual_account");
    const [selectedBank, setSelectedBank] = useState("BRI");
    const [paymentData, setPaymentData] = useState(null);
    const [transactionCode, setTransactionCode] = useState(null);
    const [checking, setChecking] = useState(false);
    const [checkInterval, setCheckInterval] = useState(null);

    useEffect(() => {
        if (isOpen) {
            // Check if user is logged in
            const token = localStorage.getItem('token');
            console.log("🔐 Token check:", token ? "✅ Found" : "❌ Not found");

            if (!token) {
                toast.error("Silakan login terlebih dahulu untuk mengakses fitur Pro", {
                    duration: 5000,
                });
                console.warn("⚠️ User not logged in. Close modal or redirect to login.");
                // Optional: close modal jika tidak ada token
                // onClose();
                return;
            }

            fetchPackages();
        } else {
            // Reset on close
            setStep(1);
            setSelectedPackage(null);
            setPaymentData(null);
            setTransactionCode(null);
            if (checkInterval) {
                clearInterval(checkInterval);
                setCheckInterval(null);
            }
        }
    }, [isOpen]);

    const fetchPackages = async () => {
        try {
            setLoading(true);
            console.log("🚀 Fetching packages...");

            const response = await singapayApi.getPackages();
            console.log("📦 Packages response:", response);
            console.log("📦 Packages data:", response.data);

            if (response.data.success && response.data.packages) {
                console.log("✅ Setting packages:", response.data.packages);
                setPackages(response.data.packages);
                // Auto select monthly package
                if (response.data.packages.length > 0) {
                    setSelectedPackage(response.data.packages[0]);
                    console.log("✅ Auto-selected package:", response.data.packages[0]);
                }
            } else {
                console.warn("⚠️ No packages in response:", response.data);
            }
        } catch (error) {
            console.error("❌ Error fetching packages:", error);
            console.error("❌ Error response:", error.response);
            console.error("❌ Error message:", error.message);

            if (error.response?.status === 401) {
                toast.error("Silakan login terlebih dahulu");
            } else {
                toast.error("Gagal memuat paket: " + (error.response?.data?.message || error.message));
            }
        } finally {
            setLoading(false);
            console.log("🏁 Fetch complete. Packages count:", packages.length);
        }
    };

    const handlePurchase = async () => {
        if (!selectedPackage) {
            toast.error("Silakan pilih paket");
            return;
        }

        try {
            setLoading(true);

            const purchaseData = {
                package_id: selectedPackage.id,
                payment_method: paymentMethod,
            };

            if (paymentMethod === "virtual_account") {
                purchaseData.bank_code = selectedBank;
            }

            console.log("📤 Creating purchase:", purchaseData);

            const response = await singapayApi.createPurchase(purchaseData);
            console.log("✅ Purchase response:", response.data);

            if (response.data.success) {
                setPaymentData(response.data.payment);
                setTransactionCode(response.data.purchase.transaction_code);
                setStep(3);

                // Start polling payment status
                startPaymentPolling(response.data.purchase.transaction_code);

                toast.success("Payment berhasil dibuat!");
            } else {
                toast.error(response.data.message || "Gagal membuat payment");
            }
        } catch (error) {
            console.error("❌ Error creating purchase:", error);
            toast.error(error.response?.data?.message || "Gagal membuat payment");
        } finally {
            setLoading(false);
        }
    };

    const startPaymentPolling = (txCode) => {
        // Check immediately
        checkPaymentStatus(txCode);

        // Then check every 5 seconds
        const interval = setInterval(() => {
            checkPaymentStatus(txCode);
        }, 5000);

        setCheckInterval(interval);
    };

    const checkPaymentStatus = async (txCode) => {
        try {
            setChecking(true);
            const response = await singapayApi.checkPaymentStatus(txCode);
            console.log("🔍 Payment status:", response.data);

            if (response.data.success && response.data.paid) {
                // Payment successful!
                if (checkInterval) {
                    clearInterval(checkInterval);
                    setCheckInterval(null);
                }

                toast.success("🎉 Pembayaran berhasil! Akses PDF Pro telah aktif.");

                // Notify parent
                if (onSuccess) {
                    onSuccess();
                }

                // Close modal after 2 seconds
                setTimeout(() => {
                    onClose();
                }, 2000);
            }
        } catch (error) {
            console.error("❌ Error checking status:", error);
        } finally {
            setChecking(false);
        }
    };

    const handleTestWebhook = async () => {
        if (!transactionCode) return;

        try {
            setLoading(true);
            const response = await singapayApi.testWebhook(transactionCode);
            console.log("🧪 Webhook test:", response.data);

            if (response.data.success) {
                toast.success("✅ Webhook triggered! Check status...");
                // Check status immediately
                setTimeout(() => {
                    checkPaymentStatus(transactionCode);
                }, 1000);
            }
        } catch (error) {
            console.error("❌ Error testing webhook:", error);
            toast.error("Gagal trigger webhook");
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        toast.success("Copied to clipboard!");
    };

    const formatRupiah = (amount) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(amount);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800 rounded-2xl shadow-2xl">
                {/* Header */}
                <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Export PDF Pro
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-500 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-400"
                    >
                        <FiX className="text-xl" />
                    </button>
                </div>

                {/* Progress Steps */}
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        {[
                            { num: 1, label: "Pilih Paket" },
                            { num: 2, label: "Metode Pembayaran" },
                            { num: 3, label: "Bayar" },
                        ].map((s, idx) => (
                            <div key={s.num} className="flex items-center flex-1">
                                <div className="flex items-center flex-1">
                                    <div
                                        className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${step >= s.num
                                                ? "bg-indigo-600 text-white"
                                                : "bg-gray-200 dark:bg-gray-700 text-gray-500"
                                            }`}
                                    >
                                        {step > s.num ? <FiCheck /> : s.num}
                                    </div>
                                    <span
                                        className={`ml-2 text-sm font-medium ${step >= s.num
                                                ? "text-gray-900 dark:text-white"
                                                : "text-gray-500"
                                            }`}
                                    >
                                        {s.label}
                                    </span>
                                </div>
                                {idx < 2 && (
                                    <div
                                        className={`flex-1 h-1 mx-2 ${step > s.num
                                                ? "bg-indigo-600"
                                                : "bg-gray-200 dark:bg-gray-700"
                                            }`}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* Step 1: Package Selection */}
                    {step === 1 && (
                        <div className="space-y-4">
                            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                                Pilih Paket Berlangganan
                            </h3>

                            {loading ? (
                                <div className="flex items-center justify-center py-12">
                                    <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                                </div>
                            ) : packages.length === 0 ? (
                                <div className="py-12 text-center">
                                    <div className="mb-4 text-4xl">📦</div>
                                    <p className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                                        Paket Tidak Tersedia
                                    </p>
                                </div>
                            ) : (
                                <div className="grid gap-4 md:grid-cols-2">
                                    {packages.map((pkg) => (
                                        <div
                                            key={pkg.id}
                                            onClick={() => setSelectedPackage(pkg)}
                                            className={`p-6 border-2 rounded-xl cursor-pointer transition-all ${selectedPackage?.id === pkg.id
                                                    ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20"
                                                    : "border-gray-200 dark:border-gray-700 hover:border-indigo-300"
                                                }`}
                                        >
                                            <div className="flex items-start justify-between mb-4">
                                                <div>
                                                    <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                                                        {pkg.name}
                                                    </h4>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                                        {pkg.duration_text}
                                                    </p>
                                                </div>
                                                {selectedPackage?.id === pkg.id && (
                                                    <div className="p-1 text-white bg-indigo-600 rounded-full">
                                                        <FiCheck />
                                                    </div>
                                                )}
                                            </div>

                                            <div className="mb-4">
                                                <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                                                    {pkg.formatted_price}
                                                </div>
                                                {pkg.package_type === "yearly" && (
                                                    <div className="mt-1 text-sm font-semibold text-green-600 dark:text-green-400">
                                                        💰 Hemat 30%!
                                                    </div>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                {pkg.features && pkg.features.map((feature, idx) => (
                                                    <div key={idx} className="flex items-start gap-2 text-sm">
                                                        <FiCheck className="mt-0.5 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
                                                        <span className="text-gray-700 dark:text-gray-300">
                                                            {feature}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <button
                                onClick={() => setStep(2)}
                                disabled={!selectedPackage || loading}
                                className="w-full py-3 font-semibold text-white transition-colors bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                Lanjutkan
                            </button>
                        </div>
                    )}

                    {/* Step 2: Payment Method */}
                    {step === 2 && (
                        <div className="space-y-4">
                            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                                Pilih Metode Pembayaran
                            </h3>

                            {/* Payment Method Selection */}
                            <div className="space-y-3">
                                {/* Virtual Account */}
                                <div
                                    onClick={() => setPaymentMethod("virtual_account")}
                                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${paymentMethod === "virtual_account"
                                            ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20"
                                            : "border-gray-200 dark:border-gray-700"
                                        }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <FiCreditCard className="text-2xl text-indigo-600 dark:text-indigo-400" />
                                            <div>
                                                <div className="font-semibold text-gray-900 dark:text-white">
                                                    Virtual Account
                                                </div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                                    Transfer bank (BRI, BNI, Danamon, Maybank)
                                                </div>
                                            </div>
                                        </div>
                                        {paymentMethod === "virtual_account" && (
                                            <FiCheck className="text-indigo-600 dark:text-indigo-400" />
                                        )}
                                    </div>

                                    {/* Bank Selection */}
                                    {paymentMethod === "virtual_account" && (
                                        <div className="grid grid-cols-2 gap-2 mt-4 md:grid-cols-4">
                                            {["BRI", "BNI", "DANAMON", "MAYBANK"].map((bank) => (
                                                <button
                                                    key={bank}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSelectedBank(bank);
                                                    }}
                                                    className={`py-2 px-3 rounded-lg font-medium transition-all ${selectedBank === bank
                                                            ? "bg-indigo-600 text-white"
                                                            : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600"
                                                        }`}
                                                >
                                                    {bank}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* QRIS */}
                                <div
                                    onClick={() => setPaymentMethod("qris")}
                                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${paymentMethod === "qris"
                                            ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20"
                                            : "border-gray-200 dark:border-gray-700"
                                        }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 text-white bg-indigo-600 rounded-lg">
                                                QR
                                            </div>
                                            <div>
                                                <div className="font-semibold text-gray-900 dark:text-white">
                                                    QRIS
                                                </div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                                    Scan QR dengan e-wallet atau mobile banking
                                                </div>
                                            </div>
                                        </div>
                                        {paymentMethod === "qris" && (
                                            <FiCheck className="text-indigo-600 dark:text-indigo-400" />
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Summary */}
                            <div className="p-4 border border-gray-200 rounded-lg dark:border-gray-700">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-gray-600 dark:text-gray-400">Paket:</span>
                                    <span className="font-semibold text-gray-900 dark:text-white">
                                        {selectedPackage?.name}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Total:</span>
                                    <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                                        {selectedPackage?.formatted_price}
                                    </span>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setStep(1)}
                                    className="flex-1 py-3 font-semibold text-gray-700 transition-colors bg-gray-200 rounded-lg dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300"
                                >
                                    Kembali
                                </button>
                                <button
                                    onClick={handlePurchase}
                                    disabled={loading}
                                    className="flex-1 py-3 font-semibold text-white transition-colors bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400"
                                >
                                    {loading ? "Memproses..." : "Bayar Sekarang"}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Payment Info */}
                    {step === 3 && paymentData && (
                        <div className="space-y-4">
                            {/* Virtual Account Info */}
                            {paymentMethod === "virtual_account" && (
                                <>
                                    <div className="p-6 text-center border-2 border-indigo-200 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 dark:border-indigo-800">
                                        <div className="mb-2 text-sm text-gray-600 dark:text-gray-400">
                                            {paymentData.bank_name}
                                        </div>
                                        <div className="mb-4 text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                                            {paymentData.va_number}
                                        </div>
                                        <button
                                            onClick={() => copyToClipboard(paymentData.va_number)}
                                            className="flex items-center gap-2 px-4 py-2 mx-auto text-sm font-medium text-indigo-600 transition-colors bg-white border border-indigo-600 rounded-lg dark:bg-gray-800 hover:bg-indigo-50"
                                        >
                                            <FiCopy /> Copy Nomor VA
                                        </button>
                                    </div>

                                    <div className="p-4 border border-gray-200 rounded-lg dark:border-gray-700">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-gray-600 dark:text-gray-400">Total Bayar:</span>
                                            <span className="text-xl font-bold text-gray-900 dark:text-white">
                                                {paymentData.formatted_amount}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400">
                                            <FiClock />
                                            <span>Berlaku sampai: {paymentData.expired_at_formatted}</span>
                                        </div>
                                    </div>

                                    {/* Payment Instructions */}
                                    <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                                        <h4 className="mb-3 font-semibold text-gray-900 dark:text-white">
                                            Cara Pembayaran:
                                        </h4>
                                        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                                            {Object.entries(paymentData.payment_instructions).map(([method, steps]) => (
                                                <div key={method}>
                                                    <div className="mb-1 font-medium text-gray-900 dark:text-white">
                                                        {method}:
                                                    </div>
                                                    <ol className="ml-4 space-y-1 list-decimal">
                                                        {steps.map((step, idx) => (
                                                            <li key={idx}>{step}</li>
                                                        ))}
                                                    </ol>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* QRIS Info */}
                            {paymentMethod === "qris" && paymentData.qris_content && (
                                <>
                                    <div className="p-6 text-center border-2 border-indigo-200 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 dark:border-indigo-800">
                                        <div className="mb-4">
                                            <img
                                                src={`data:image/png;base64,${paymentData.qris_content}`}
                                                alt="QRIS Code"
                                                className="w-64 h-64 mx-auto"
                                            />
                                        </div>
                                        <div className="mb-2 text-sm text-gray-600 dark:text-gray-400">
                                            Scan dengan aplikasi e-wallet atau mobile banking
                                        </div>
                                    </div>

                                    <div className="p-4 border border-gray-200 rounded-lg dark:border-gray-700">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-gray-600 dark:text-gray-400">Total Bayar:</span>
                                            <span className="text-xl font-bold text-gray-900 dark:text-white">
                                                {paymentData.formatted_amount}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400">
                                            <FiClock />
                                            <span>Berlaku sampai: {paymentData.expired_at_formatted}</span>
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* Status Check */}
                            <div className="p-4 border-2 border-gray-200 rounded-lg dark:border-gray-700">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-3 h-3 rounded-full ${checking ? 'bg-yellow-500 animate-pulse' : 'bg-gray-400'}`} />
                                        <span className="font-medium text-gray-900 dark:text-white">
                                            Status Pembayaran
                                        </span>
                                    </div>
                                    {checking && (
                                        <span className="text-sm text-gray-500 dark:text-gray-400">
                                            Checking...
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                                    <FiAlertCircle className="mt-0.5 flex-shrink-0" />
                                    <span>
                                        Sistem akan otomatis mendeteksi pembayaran Anda. Proses verifikasi memakan waktu 1-5 menit setelah pembayaran berhasil.
                                    </span>
                                </div>
                            </div>

                            {/* Mock Mode Test Button */}
                            <div className="p-4 border-2 border-amber-200 rounded-lg bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800">
                                <div className="flex items-start gap-2 mb-3 text-sm text-amber-900 dark:text-amber-100">
                                    <FiAlertCircle className="mt-0.5 flex-shrink-0" />
                                    <div>
                                        <div className="font-semibold">Testing Mode</div>
                                        <div className="text-amber-700 dark:text-amber-200">
                                            Klik tombol di bawah untuk simulasi pembayaran berhasil (hanya untuk testing)
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={handleTestWebhook}
                                    disabled={loading}
                                    className="w-full py-2 font-medium text-amber-900 transition-colors bg-amber-200 rounded-lg hover:bg-amber-300 disabled:bg-gray-400"
                                >
                                    🧪 Simulasi Pembayaran Berhasil
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PdfProPaymentModal;
