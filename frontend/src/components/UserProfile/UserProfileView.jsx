import { useEffect, useState } from "react";
import { FiUser, FiMail, FiPhone, FiCalendar, FiEdit2, FiLogOut, FiCheckCircle, FiXCircle, FiClock, FiAtSign } from "react-icons/fi";
import userApi from "../../services/userApi";

export default function UserProfileView({ onEdit }) {
  const userLS = JSON.parse(localStorage.getItem("user"));
  const userId = userLS?.id;

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({});
  const [previewPhoto, setPreviewPhoto] = useState(null);

  const fetchUser = async () => {
    try {
      const res = await userApi.getById(userId);
      const u = res.data.data;

      setUser(u);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { icon: FiCheckCircle, color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400", label: "Aktif" },
      inactive: { icon: FiClock, color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400", label: "Tidak Aktif" },
      suspended: { icon: FiXCircle, color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400", label: "Ditangguhkan" },
    };

    const config = statusConfig[status] || statusConfig.inactive;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="text-sm" />
        {config.label}
      </span>
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Cover Background */}
        <div className="h-32 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>

        {/* Profile Info */}
        <div className="px-6 pb-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 -mt-16 sm:-mt-12">
            {/* Avatar */}
            <div className="relative">
              <img
                src={"https://ui-avatars.com/api/?name=" + encodeURIComponent(user.name || "User") + "&background=6366f1&color=fff&size=128"}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-lg"
              />
              {user.phone_verified_at && (
                <div className="absolute bottom-2 right-2 bg-green-500 rounded-full p-1.5 border-2 border-white dark:border-gray-800">
                  <FiCheckCircle className="text-white text-sm" />
                </div>
              )}
            </div>

            {/* Name & Username */}
            <div className="flex-1 text-center sm:text-left sm:mb-2">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {user.name}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 flex items-center gap-1 justify-center sm:justify-start mt-1">
                <FiAtSign className="text-sm" />
                {user.username}
              </p>
              <div className="mt-2">
                {getStatusBadge(user.account_status)}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 sm:mb-2">
              <button
                onClick={onEdit}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors shadow-sm"
              >
                <FiEdit2 className="text-sm" />
                Edit Profil
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors shadow-sm"
              >
                <FiLogOut className="text-sm" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Information Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contact Information */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <FiUser className="text-indigo-600 dark:text-indigo-400" />
            Informasi Kontak
          </h2>
          <div className="space-y-4">
            <InfoItem
              icon={FiPhone}
              label="No WhatsApp"
              value={user.phone || "-"}
            />
            <InfoItem
              icon={FiCheckCircle}
              label="Status Verifikasi"
              value={user.phone_verified_at ? "✔ Terverifikasi" : "Belum Terverifikasi"}
              valueColor={user.phone_verified_at ? "text-green-600 dark:text-green-400" : "text-gray-600 dark:text-gray-400"}
            />
          </div>
        </div>

        {/* Account Information */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <FiCalendar className="text-indigo-600 dark:text-indigo-400" />
            Informasi Akun
          </h2>
          <div className="space-y-4">
            <InfoItem
              icon={FiUser}
              label="Nama Lengkap"
              value={user.name}
            />
            <InfoItem
              icon={FiAtSign}
              label="Username"
              value={user.username}
            />
            <InfoItem
              icon={FiCalendar}
              label="Terdaftar Sejak"
              value={new Date(user.created_at).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoItem({ icon: Icon, label, value, valueColor = "text-gray-900 dark:text-white" }) {
  return (
    <div className="flex items-start gap-3">
      <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
        <Icon className="text-gray-600 dark:text-gray-400" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-600 dark:text-gray-400">{label}</p>
        <p className={`font-medium ${valueColor} truncate`}>
          {value}
        </p>
      </div>
    </div>
  );
}
