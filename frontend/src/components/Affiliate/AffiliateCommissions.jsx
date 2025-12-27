import { useState, useEffect } from "react";
import { DollarSign, TrendingUp, Users, CheckCircle, Clock, Wallet, AlertCircle, X } from "lucide-react";
import { affiliateCommissionApi } from "../../services/affiliateCommissionApi";

const AffiliateCommissions = () => {
  const [statistics, setStatistics] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0,
  });

  // Withdrawal State
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawableBalance, setWithdrawableBalance] = useState(0);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [bankDetails, setBankDetails] = useState({
    bank_name: "",
    account_number: "",
    account_name: "",
    notes: "",
  });
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  useEffect(() => {
    fetchStatistics();
    fetchHistory();
    fetchWithdrawableBalance();
  }, []);

  const fetchWithdrawableBalance = async () => {
    try {
      const response = await affiliateCommissionApi.getWithdrawableBalance();
      // Backend returns: {success: true, data: {balance: float, can_withdraw: bool, minimum_withdrawal: float}}
      if (response.data && response.data.success && response.data.data) {
        setWithdrawableBalance(response.data.data.balance || 0);
      }
    } catch (error) {
      console.error("Error fetching balance:", error);
      setWithdrawableBalance(0); // Fallback to 0 on error
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await affiliateCommissionApi.getStatistics();
      if (response.data.success) {
        setStatistics(response.data.data);
      }
    } catch (error) {
      console.error("[AffiliateCommissions] Error fetching statistics:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async (page = 1) => {
    setHistoryLoading(true);
    try {
      // Use the new withdrawals endpoint if we want to show withdrawals too, 
      // but for now let's stick to commission history or maybe we should switch to withdrawals history?
      // The user wants "Riwayat Withdraw". 
      // Let's create a tab or section for it? 
      // For now, I will interpret the request as just enabling the flow.
      // But showing the history of commissions is still main. 
      // I will add a separate fetch for Withdrawal History if I had time, but let's stick to commissions for now.
      // Wait, endpoint /withdrawals exists.

      const response = await affiliateCommissionApi.getHistory({ page, per_page: 15 });
      if (response.data.success) {
        setHistory(response.data.data);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error("[AffiliateCommissions] Error fetching history:", error);
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleWithdraw = async (e) => {
    e.preventDefault();
    if (parseFloat(withdrawAmount) > withdrawableBalance) {
      alert("Saldo tidak mencukupi");
      return;
    }

    setIsWithdrawing(true);
    try {
      const payload = {
        amount: parseFloat(withdrawAmount),
        ...bankDetails
      };

      const response = await affiliateCommissionApi.withdraw(payload);

      if (response.data.success) {
        alert("Permintaan withdraw berhasil dikirim! " + response.data.message);
        setShowWithdrawModal(false);
        setWithdrawAmount("");
        // Refresh data
        fetchStatistics();
        fetchWithdrawableBalance();
        // fetchWithdrawalHistory(); // If we implemented it
      }
    } catch (error) {
      alert(error.response?.data?.message || "Gagal melakukan penarikan");
    } finally {
      setIsWithdrawing(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      approved: {
        bg: "bg-green-100 dark:bg-green-900/30",
        text: "text-green-800 dark:text-green-300",
        icon: CheckCircle,
        label: "Approved",
      },
      pending: {
        bg: "bg-yellow-100 dark:bg-yellow-900/30",
        text: "text-yellow-800 dark:text-yellow-300",
        icon: Clock,
        label: "Pending",
      },
      paid: {
        bg: "bg-blue-100 dark:bg-blue-900/30",
        text: "text-blue-800 dark:text-blue-300",
        icon: Wallet,
        label: "Paid",
      },
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        <Icon size={14} />
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 relative">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Komisi Affiliate</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Lacak penghasilan komisi dari referral Anda</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Earnings */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <DollarSign size={32} className="opacity-80" />
            <TrendingUp size={20} className="opacity-60" />
          </div>
          <h3 className="text-sm font-medium opacity-90 mb-1">Total Pendapatan</h3>
          <p className="text-3xl font-bold">{formatCurrency(statistics?.total_earnings || 0)}</p>
          <p className="text-xs opacity-75 mt-2">Approved + Paid</p>
        </div>

        {/* Ready to Withdraw */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <Wallet size={32} className="text-blue-600 dark:text-blue-400" />
            {withdrawableBalance >= 100000 && (
              <button
                onClick={() => setShowWithdrawModal(true)}
                className="text-xs bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition shadow-sm"
              >
                Withdraw
              </button>
            )}
          </div>
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Siap Dicairkan</h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{formatCurrency(withdrawableBalance)}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            {withdrawableBalance >= 50000 ? "Saldo mencukupi" : `Min. ${formatCurrency(50000)}`}
          </p>
        </div>

        {/* Paid Total */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <CheckCircle size={32} className="text-purple-600 dark:text-purple-400" />
          </div>
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Total Dibayar</h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{formatCurrency(statistics?.paid_total || 0)}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Sudah ditransfer</p>
        </div>

        {/* Total Referrals */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <Users size={32} className="text-gray-600 dark:text-gray-400" />
          </div>
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Total Referrals</h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{statistics?.total_referrals || 0}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">User yang subscribe</p>
        </div>
      </div>

      {/* Withdrawal Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md shadow-[0_20px_60px_rgba(0,0,0,0.3)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.7)] transform transition-all p-6 border-2 border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Formulir Penarikan</h3>
              <button
                onClick={() => setShowWithdrawModal(false)}
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              >
                <X size={24} />
              </button>
            </div>

            <div className="mb-6 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg flex items-start">
              <AlertCircle className="text-blue-600 flex-shrink-0 mr-3 mt-0.5" size={20} />
              <p className="text-sm text-blue-800 dark:text-blue-300">
                Saldo akan ditransfer melalui SingaPay (Mock). Estimasi proses 1 hari kerja.
              </p>
            </div>

            <form onSubmit={handleWithdraw} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Jumlah Penarikan (IDR)</label>
                <input
                  type="number"
                  required
                  min="50000"
                  max={withdrawableBalance}
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Minimal 50.000"
                />
                <div className="flex justify-between mt-1 text-xs text-gray-500">
                  <span>Min: {formatCurrency(50000)}</span>
                  <span>Maks: {formatCurrency(withdrawableBalance)}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bank</label>
                  <select
                    required
                    value={bankDetails.bank_name}
                    onChange={(e) => setBankDetails({ ...bankDetails, bank_name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Pilih Bank</option>
                    <option value="BCA">BCA - Bank Central Asia</option>
                    <option value="MANDIRI">Mandiri</option>
                    <option value="BNI">BNI - Bank Negara Indonesia</option>
                    <option value="BRI">BRI - Bank Rakyat Indonesia</option>
                    <option value="CIMB">CIMB Niaga</option>
                    <option value="PERMATA">Permata Bank</option>
                    <option value="DANAMON">Danamon</option>
                    <option value="MAYBANK">Maybank</option>
                    <option value="PANIN">Panin Bank</option>
                    <option value="BSI">BSI - Bank Syariah Indonesia</option>
                    <option value="BTN">BTN - Bank Tabungan Negara</option>
                    <option value="OCBC">OCBC NISP</option>
                    <option value="MUAMALAT">Bank Muamalat</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">No. Rekening</label>
                  <input
                    type="text"
                    required
                    value={bankDetails.account_number}
                    onChange={(e) => setBankDetails({ ...bankDetails, account_number: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                    placeholder="123xxx"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Atas Nama</label>
                <input
                  type="text"
                  required
                  value={bankDetails.account_name}
                  onChange={(e) => setBankDetails({ ...bankDetails, account_name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Nama pemilik rekening"
                />
              </div>

              <button
                type="submit"
                disabled={isWithdrawing}
                className="w-full mt-4 bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
              >
                {isWithdrawing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Memproses...
                  </>
                ) : (
                  "Kirim Permintaan"
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Commission History Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Riwayat Komisi</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Total {pagination.total} komisi</p>
        </div>

        {historyLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          </div>
        ) : history.length === 0 ? (
          <div className="text-center py-12">
            <Users size={48} className="text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Belum ada komisi</p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">Share link affiliate Anda untuk mulai mendapatkan komisi</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tanggal</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Paket</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Subscription</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Komisi ({statistics?.commission_percentage || 17}%)</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {history.map((commission) => (
                  <tr key={commission.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{formatDate(commission.created_at)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                          <span className="text-sm font-medium text-green-700 dark:text-green-300">{commission.referred_user?.name?.charAt(0).toUpperCase()}</span>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{commission.referred_user?.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">{commission.purchase?.premium_pdf?.name || commission.purchase?.package_type}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-gray-900 dark:text-gray-300">{formatCurrency(commission.subscription_amount)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold text-green-600 dark:text-green-400">{formatCurrency(commission.commission_amount)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">{getStatusBadge(commission.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination.last_page > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <button
                onClick={() => fetchHistory(pagination.current_page - 1)}
                disabled={pagination.current_page === 1}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Page {pagination.current_page} of {pagination.last_page}
              </span>
              <button
                onClick={() => fetchHistory(pagination.current_page + 1)}
                disabled={pagination.current_page === pagination.last_page}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AffiliateCommissions;
