import { useState, useEffect } from "react";
import { DollarSign, TrendingUp, Users, CheckCircle, Clock, Wallet, AlertCircle, ExternalLink } from "lucide-react";
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

  useEffect(() => {
    fetchStatistics();
    fetchHistory();
  }, []);

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
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
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

        {/* Approved Balance */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <CheckCircle size={32} className="text-green-600 dark:text-green-400" />
          </div>
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Saldo Approved</h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{formatCurrency(statistics?.approved_balance || 0)}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Siap untuk withdraw</p>
        </div>

        {/* Paid Total */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <Wallet size={32} className="text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Total Dibayar</h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{formatCurrency(statistics?.paid_total || 0)}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Sudah ditransfer</p>
        </div>

        {/* Total Referrals */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <Users size={32} className="text-purple-600 dark:text-purple-400" />
          </div>
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Total Referrals</h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{statistics?.total_referrals || 0}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">User yang subscribe</p>
        </div>
      </div>

      {/* Withdrawal Info */}
      {statistics && (
        <div className={`rounded-xl p-6 border-2 ${statistics.can_withdraw ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800" : "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800"}`}>
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-lg ${statistics.can_withdraw ? "bg-green-100 dark:bg-green-900/40" : "bg-yellow-100 dark:bg-yellow-900/40"}`}>
              {statistics.can_withdraw ? <CheckCircle className="text-green-600 dark:text-green-400" size={24} /> : <AlertCircle className="text-yellow-600 dark:text-yellow-400" size={24} />}
            </div>
            <div className="flex-1">
              <h4 className={`font-semibold text-lg mb-1 ${statistics.can_withdraw ? "text-green-900 dark:text-green-200" : "text-yellow-900 dark:text-yellow-200"}`}>
                {statistics.can_withdraw ? "Saldo Dapat Ditarik!" : "Minimum Withdrawal Belum Tercapai"}
              </h4>
              <p className={`text-sm ${statistics.can_withdraw ? "text-green-700 dark:text-green-300" : "text-yellow-700 dark:text-yellow-300"}`}>
                {statistics.can_withdraw
                  ? `Anda memiliki ${formatCurrency(statistics.approved_balance)} yang siap untuk ditarik.`
                  : `Minimum withdrawal adalah ${formatCurrency(statistics.minimum_withdrawal)}. Saldo approved Anda: ${formatCurrency(statistics.approved_balance)}`}
              </p>
              {statistics.can_withdraw && (
                <button className="mt-4 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                  Withdraw (Coming Soon)
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Commission History Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
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
