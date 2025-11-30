import React, { useState, useEffect } from "react";
import { BarChart2, Calendar, Smartphone, TrendingUp, Users, Loader } from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { affiliateTrackingApi } from "../../../services/Affiliate/affiliateApi";
import { toast } from "react-toastify";

const AffiliateTracking = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [deviceBreakdown, setDeviceBreakdown] = useState([]);
  const [monthlyBreakdown, setMonthlyBreakdown] = useState([]);
  const [tracksPage, setTracksPage] = useState(1);
  const [tracks, setTracks] = useState([]);
  const [pagination, setPagination] = useState({});

  useEffect(() => {
    fetchAllData();
  }, []);

  useEffect(() => {
    if (activeTab === "tracks") {
      fetchTracks(tracksPage);
    }
  }, [activeTab, tracksPage]);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [statsResponse, deviceResponse, monthlyResponse] = await Promise.all([
        affiliateTrackingApi.getStatistics(),
        affiliateTrackingApi.getDeviceBreakdown(),
        affiliateTrackingApi.getMonthlyBreakdown(),
      ]);

      if (statsResponse.data?.success) {
        setStats(statsResponse.data.data);
      }
      if (deviceResponse.data?.success) {
        setDeviceBreakdown(deviceResponse.data.data || []);
      }
      if (monthlyResponse.data?.success) {
        setMonthlyBreakdown(monthlyResponse.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Gagal memuat data tracking");
    } finally {
      setLoading(false);
    }
  };

  const fetchTracks = async (page) => {
    try {
      const response = await affiliateTrackingApi.getTracks({ page });
      if (response.data?.success) {
        setTracks(response.data.data || []);
        setPagination(response.data.pagination || {});
      }
    } catch (error) {
      console.error("Error fetching tracks:", error);
      toast.error("Gagal memuat data klik");
    }
  };

  const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"];

  if (loading && activeTab === "overview") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center">
          <Loader className="w-8 h-8 text-green-600 animate-spin mb-2" />
          <p className="text-gray-600 dark:text-gray-400">Memuat data tracking...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <BarChart2 className="w-8 h-8 text-green-600" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Tracking & Analytics
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Pantau performa link affiliate dan analisis traffic Anda
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
        {[
          { id: "overview", label: "Ringkasan" },
          { id: "device", label: "Device Breakdown" },
          { id: "monthly", label: "Trend Bulanan" },
          { id: "tracks", label: "Detail Klik" },
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

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Klik
                </p>
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {stats?.total_clicks || 0}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Klik ke link affiliate Anda
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Lead
                </p>
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {stats?.total_leads || 0}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Lead yang masuk
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Conversion Rate
                </p>
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {stats?.conversion_rate || 0}%
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Lead dari klik
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Rata-rata per Klik
                </p>
                <Calendar className="w-5 h-5 text-orange-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {stats?.avg_lead_per_click || 0}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Lead per klik
              </p>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Device Distribution */}
            {deviceBreakdown.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Distribusi Device
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={deviceBreakdown}
                      dataKey="count"
                      nameKey="device"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label
                    >
                      {deviceBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Monthly Trend */}
            {monthlyBreakdown.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Tren Klik Bulanan
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyBreakdown}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="count"
                      stroke="#10b981"
                      strokeWidth={2}
                      dot={{ fill: "#10b981" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Device Tab */}
      {activeTab === "device" && deviceBreakdown.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Analisis Device
          </h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={deviceBreakdown}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="device" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip />
              <Bar dataKey="count" fill="#10b981" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>

          {/* Device List */}
          <div className="mt-8 space-y-2">
            {deviceBreakdown.map((device, index) => (
              <div
                key={index}
                className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
              >
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  <Smartphone className="w-4 h-4 inline-block mr-2 text-green-600" />
                  {device.device}
                </span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {device.count} klik
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Monthly Tab */}
      {activeTab === "monthly" && monthlyBreakdown.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Tren Klik Bulanan
          </h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={monthlyBreakdown}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>

          {/* Monthly List */}
          <div className="mt-8 space-y-2">
            {monthlyBreakdown.map((month, index) => (
              <div
                key={index}
                className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
              >
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  <Calendar className="w-4 h-4 inline-block mr-2 text-blue-600" />
                  {month.month}
                </span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {month.count} klik
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tracks Tab */}
      {activeTab === "tracks" && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Waktu
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Device
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Browser
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    OS
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    IP Address
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {tracks.length > 0 ? (
                  tracks.map((track, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200"
                    >
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">
                        {new Date(track.tracked_at).toLocaleString("id-ID")}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">
                        <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded text-xs font-medium">
                          {track.device_type || "-"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">
                        {track.browser || "-"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">
                        {track.os || "-"}
                      </td>
                      <td className="px-6 py-4 text-sm font-mono text-gray-600 dark:text-gray-400">
                        {track.ip_address || "-"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                      Belum ada data klik
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
                Menampilkan {tracks.length} dari {pagination.total} data
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setTracksPage(Math.max(1, tracksPage - 1))}
                  disabled={tracksPage === 1}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg disabled:opacity-50"
                >
                  Sebelumnya
                </button>
                <span className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
                  Halaman {pagination.current_page} dari {pagination.last_page}
                </span>
                <button
                  onClick={() =>
                    setTracksPage(
                      Math.min(pagination.last_page || 1, tracksPage + 1)
                    )
                  }
                  disabled={tracksPage >= (pagination.last_page || 1)}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg disabled:opacity-50"
                >
                  Selanjutnya
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AffiliateTracking;
