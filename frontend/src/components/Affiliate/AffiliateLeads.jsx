import React, { useState, useEffect } from "react";
import {
  Users2,
  Loader,
  Mail,
  MessageSquare,
  Phone,
  Calendar,
  Filter,
  ChevronDown,
  CheckCircle,
  Clock,
  Target,
} from "lucide-react";
import { affiliateLeadApi } from "../../services/Affiliate/affiliateApi";
import { toast } from "react-toastify";

const AffiliateLeads = () => {
  const [activeTab, setActiveTab] = useState("list");
  const [leads, setLeads] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [page, setPage] = useState(1);
  const [stats, setStats] = useState(null);

  // Filter states
  const [filterStatus, setFilterStatus] = useState("");
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");

  const leadStatuses = [
    { value: "baru", label: "Baru", color: "bg-blue", icon: Clock },
    {
      value: "dihubungi",
      label: "Dihubungi",
      color: "bg-yellow",
      icon: Phone,
    },
    { value: "closing", label: "Closing", color: "bg-green", icon: Target },
  ];

  useEffect(() => {
    if (activeTab === "list") {
      fetchLeads();
    } else if (activeTab === "stats") {
      fetchStats();
    }
  }, [activeTab, page, filterStatus, filterDateFrom, filterDateTo]);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const response = await affiliateLeadApi.getMyLeads({
        page,
        per_page: 20,
        status: filterStatus || null,
        date_from: filterDateFrom || null,
        date_to: filterDateTo || null,
      });

      if (response.data?.success) {
        setLeads(response.data.data || []);
        setPagination(response.data.pagination || {});
      }
    } catch (error) {
      console.error("Error fetching leads:", error);
      toast.error("Gagal memuat lead");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await affiliateLeadApi.getStatistics();

      if (response.data?.success) {
        setStats(response.data.data || {});
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
      toast.error("Gagal memuat statistik");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = async (leadId) => {
    try {
      const response = await affiliateLeadApi.show(leadId);
      if (response.data?.success) {
        setSelectedLead(response.data.data);
        setActiveTab("detail");
      }
    } catch (error) {
      console.error("Error fetching lead detail:", error);
      toast.error("Gagal memuat detail lead");
    }
  };

  const handleUpdateStatus = async (leadId, newStatus) => {
    try {
      const response = await affiliateLeadApi.updateStatus(leadId, newStatus);
      if (response.data?.success) {
        toast.success("Status lead berhasil diubah");
        if (activeTab === "detail" && selectedLead?.id === leadId) {
          setSelectedLead({ ...selectedLead, status: newStatus });
        }
        // Refresh leads
        await fetchLeads();
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Gagal mengubah status lead");
    }
  };

  const handleResetFilter = () => {
    setFilterStatus("");
    setFilterDateFrom("");
    setFilterDateTo("");
    setPage(1);
  };

  const getStatusConfig = (status) => {
    return leadStatuses.find((s) => s.value === status);
  };

  const getStatusColor = (status) => {
    const config = getStatusConfig(status);
    const colorMap = {
      "bg-blue": "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400",
      "bg-yellow":
        "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400",
      "bg-green":
        "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
    };
    return colorMap[config?.color] || colorMap["bg-blue"];
  };

  if (loading && leads.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center">
          <Loader className="w-8 h-8 text-green-600 animate-spin mb-2" />
          <p className="text-gray-600 dark:text-gray-400">Memuat lead...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Users2 className="w-8 h-8 text-green-600" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Lead Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Kelola dan pantau lead yang masuk dari link affiliate Anda
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
        {[
          { id: "list", label: "Daftar Lead" },
          { id: "stats", label: "Statistik" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 font-medium transition-all duration-200 border-b-2 ${
              activeTab === tab.id
                ? "border-green-600 text-green-600 dark:text-green-400"
                : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* List Tab */}
      {activeTab === "list" && (
        <div className="space-y-6">
          {/* Filter Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-5 h-5 text-green-600" />
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Filter Lead
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Status Filter */}
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
                  Status
                </label>
                <select
                  value={filterStatus}
                  onChange={(e) => {
                    setFilterStatus(e.target.value);
                    setPage(1);
                  }}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Semua Status</option>
                  {leadStatuses.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date From */}
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
                  Dari Tanggal
                </label>
                <input
                  type="date"
                  value={filterDateFrom}
                  onChange={(e) => {
                    setFilterDateFrom(e.target.value);
                    setPage(1);
                  }}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* Date To */}
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
                  Hingga Tanggal
                </label>
                <input
                  type="date"
                  value={filterDateTo}
                  onChange={(e) => {
                    setFilterDateTo(e.target.value);
                    setPage(1);
                  }}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* Reset Button */}
              <div className="flex items-end">
                <button
                  onClick={handleResetFilter}
                  className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg font-medium transition-colors duration-200"
                >
                  Reset Filter
                </button>
              </div>
            </div>
          </div>

          {/* Leads Table */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Nama
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Kontak
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Minat
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Waktu Submit
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {leads.length > 0 ? (
                    leads.map((lead) => (
                      <tr
                        key={lead.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200"
                      >
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900 dark:text-white">
                            {lead.name}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1 text-sm">
                            {lead.email && (
                              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                <Mail className="w-4 h-4" />
                                {lead.email}
                              </div>
                            )}
                            {lead.whatsapp && (
                              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                <MessageSquare className="w-4 h-4" />
                                {lead.whatsapp}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {lead.interest || "-"}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              lead.status
                            )}`}
                          >
                            {getStatusConfig(lead.status)?.label}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {new Date(lead.submitted_at).toLocaleString("id-ID")}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleViewDetail(lead.id)}
                            className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded text-sm font-medium hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors duration-200"
                          >
                            Lihat Detail
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-8 text-center">
                        <p className="text-gray-500 dark:text-gray-400">
                          Belum ada lead yang masuk
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.total > 0 && (
              <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Menampilkan {leads.length} dari {pagination.total} lead
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg disabled:opacity-50"
                  >
                    Sebelumnya
                  </button>
                  <span className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
                    Halaman {pagination.current_page} dari {pagination.last_page}
                  </span>
                  <button
                    onClick={() =>
                      setPage(Math.min(pagination.last_page || 1, page + 1))
                    }
                    disabled={page >= (pagination.last_page || 1)}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg disabled:opacity-50"
                  >
                    Selanjutnya
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Stats Tab */}
      {activeTab === "stats" && stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Lead
              </p>
              <Users2 className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {stats.total_leads || 0}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Lead Baru
              </p>
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {stats.status_baru || 0}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Dihubungi
              </p>
              <Phone className="w-5 h-5 text-yellow-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {stats.status_dihubungi || 0}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Closing
              </p>
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {stats.status_closing || 0}
            </p>
          </div>
        </div>
      )}

      {/* Detail Tab */}
      {activeTab === "detail" && selectedLead && (
        <div className="space-y-6">
          <button
            onClick={() => setActiveTab("list")}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
          >
            ← Kembali ke Daftar
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Detail */}
            <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8 shadow-sm space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {selectedLead.name}
                </h2>
                <div className="flex gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      selectedLead.status
                    )}`}
                  >
                    {getStatusConfig(selectedLead.status)?.label}
                  </span>
                </div>
              </div>

              {/* Contact Info */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Informasi Kontak
                </h3>
                <div className="space-y-3">
                  {selectedLead.email && (
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-green-600" />
                      <a
                        href={`mailto:${selectedLead.email}`}
                        className="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400"
                      >
                        {selectedLead.email}
                      </a>
                    </div>
                  )}
                  {selectedLead.whatsapp && (
                    <div className="flex items-center gap-3">
                      <MessageSquare className="w-5 h-5 text-green-600" />
                      <a
                        href={`https://wa.me/${selectedLead.whatsapp.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400"
                      >
                        {selectedLead.whatsapp}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Interest */}
              {selectedLead.interest && (
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Minat / Kebutuhan
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    {selectedLead.interest}
                  </p>
                </div>
              )}

              {/* Notes */}
              {selectedLead.notes && (
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Catatan Tambahan
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    {selectedLead.notes}
                  </p>
                </div>
              )}
            </div>

            {/* Sidebar - Status Change & Info */}
            <div className="space-y-6">
              {/* Status Change Card */}
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Ubah Status
                </h3>
                <div className="space-y-2">
                  {leadStatuses.map((status) => (
                    <button
                      key={status.value}
                      onClick={() =>
                        handleUpdateStatus(selectedLead.id, status.value)
                      }
                      disabled={selectedLead.status === status.value}
                      className={`w-full px-4 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                        selectedLead.status === status.value
                          ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-300 dark:border-green-700"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600"
                      }`}
                    >
                      <status.icon className="w-4 h-4" />
                      {status.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Timeline Card */}
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Informasi Timeline
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase mb-1">
                      Waktu Submit
                    </p>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {new Date(
                        selectedLead.submitted_at
                      ).toLocaleString("id-ID")}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase mb-1">
                      Device
                    </p>
                    <p className="text-sm text-gray-900 dark:text-white capitalize">
                      {selectedLead.device_type || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase mb-1">
                      IP Address
                    </p>
                    <p className="text-sm font-mono text-gray-900 dark:text-white">
                      {selectedLead.ip_address || "-"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AffiliateLeads;
