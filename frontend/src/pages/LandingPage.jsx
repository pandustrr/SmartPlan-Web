import { Link } from "react-router-dom";
import {
  BarChart3,
  DollarSign,
  TrendingUp,
  Shield,
  Users,
  Rocket,
  CheckCircle,
  ArrowRight,
  LineChart,
  Target,
  Zap,
  Calendar,
  FileText,
} from "lucide-react";
import Navbar from "../components/Layout/Navbar";
import Footer from "../components/Layout/Footer";

function LandingPage({ isDarkMode, toggleDarkMode }) {
  const features = [
    {
      icon: BarChart3,
      title: "Analisis Bisnis Mendalam",
      description:
        "Dapatkan insight mendalam tentang performa bisnis Anda dengan analisis data yang powerful dan real-time. Pantau KPI dan metrik penting dalam satu dashboard.",
    },
    {
      icon: DollarSign,
      title: "Manajemen Keuangan",
      description:
        "Kelola keuangan bisnis dengan mudah, pantau pendapatan dan pengeluaran secara real-time dengan dashboard yang intuitif dan laporan otomatis.",
    },
    {
      icon: TrendingUp,
      title: "Forecast & Prediksi AI",
      description:
        "Prediksi masa depan bisnis Anda dengan algoritma AI yang akurat untuk perencanaan yang lebih baik dan pengambilan keputusan yang tepat.",
    },
    {
      icon: LineChart,
      title: "Laporan Otomatis",
      description:
        "Generate laporan bisnis otomatis dengan visualisasi data yang mudah dipahami. Export dalam berbagai format untuk presentasi dan analisis.",
    },
    {
      icon: Target,
      title: "Perencanaan Strategis",
      description:
        "Buat dan kelola rencana bisnis dengan tools yang membantu Anda mencapai target dengan efisien. Tetapkan goals dan track progress secara real-time.",
    },
    {
      icon: Calendar,
      title: "Manajemen Proyek",
      description:
        "Kelola proyek bisnis dengan timeline yang jelas, assign tugas ke tim, dan pantau progress secara real-time untuk memastikan semuanya berjalan sesuai rencana.",
    },
  ];

  const benefits = [
    {
      icon: Shield,
      title: "Keamanan Data Terjamin",
      description:
        "Data bisnis Anda dilindungi dengan enkripsi tingkat enterprise dan backup otomatis.",
    },
    {
      icon: Users,
      title: "Kolaborasi Tim Mudah",
      description:
        "Bekerjasama dengan tim secara efisien dengan tools kolaborasi yang terintegrasi.",
    },
    {
      icon: Rocket,
      title: "Implementasi Cepat",
      description:
        "Mulai gunakan platform dalam hitungan menit tanpa setup yang rumit.",
    },
    {
      icon: FileText,
      title: "Dukungan 24/7",
      description:
        "Tim support kami siap membantu kapanpun Anda membutuhkan bantuan.",
    },
  ];

  const stats = [
    { number: "500+", label: "Bisnis Terkelola" },
    { number: "98%", label: "Kepuasan Pengguna" },
    { number: "24/7", label: "Support Available" },
    { number: "50K+", label: "Laporan Dibuat" },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-green-50 dark:from-gray-900 dark:to-gray-800">
      {/* Navigation */}
      <Navbar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-sm font-medium mb-6">
              <Zap className="w-4 h-4 mr-2" />
              Platform Manajemen Bisnis All-in-One
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              Kelola Bisnis Lebih
              <span className="text-green-600 dark:text-green-400 block">
                Cerdas & Efisien
              </span>
            </h1>

            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto leading-relaxed">
              Transformasi cara Anda mengelola bisnis dengan platform lengkap
              untuk perencanaan strategis, analisis keuangan mendalam, dan
              prediksi AI yang akurat. Semua dalam satu solusi terintegrasi.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/register"
                className="bg-green-600 text-white px-8 py-4 rounded-lg hover:bg-green-700 transition-all duration-200 font-medium text-lg inline-flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Mulai Sekarang Gratis
                <ArrowRight className="ml-2" size={20} />
              </Link>
              <Link
                to="#features"
                className="border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-8 py-4 rounded-lg hover:border-green-600 dark:hover:border-green-400 transition-all duration-200 font-medium text-lg hover:shadow-lg"
              >
                Pelajari Fitur
              </Link>
            </div>
          </div>

          {/* Stats Section */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 dark:text-gray-400 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-white dark:bg-gray-800">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Semua yang Anda Butuhkan dalam Satu Platform
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Dari perencanaan hingga eksekusi, kami menyediakan semua tools
              yang Anda butuhkan untuk mengembangkan bisnis secara efektif dan
              efisien
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-gray-50 dark:bg-gray-700 p-8 rounded-2xl hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-gray-600 hover:border-green-200 dark:hover:border-green-800 group"
                >
                  <div className="w-14 h-14 bg-green-100 dark:bg-green-900/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Icon
                      className="text-green-600 dark:text-green-400"
                      size={28}
                    />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="about" className="py-20 px-6 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Mengapa Memilih PlanWeb?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Kami berkomitmen untuk memberikan pengalaman terbaik dalam
              mengelola bisnis Anda
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div key={index} className="text-center group">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                    <Icon
                      className="text-green-600 dark:text-green-400"
                      size={32}
                    />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-20 px-6 bg-white dark:bg-gray-800">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Apa Kata Pengguna Kami
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Dengarkan pengalaman langsung dari bisnis yang telah
              bertransformasi
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-50 dark:bg-gray-700 p-8 rounded-2xl">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                  AS
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white">
                    Ahmad Setyawan
                  </h4>
                  <p className="text-green-600 dark:text-green-400 text-sm">
                    CEO RetailHub
                  </p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400 italic">
                "PlanWeb telah mengubah cara kami mengelola bisnis retail.
                Analisis datanya membantu kami mengambil keputusan yang lebih
                tepat dan meningkatkan efisiensi operasional hingga 40%."
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 p-8 rounded-2xl">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                  DS
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white">
                    Dewi Sartika
                  </h4>
                  <p className="text-green-600 dark:text-green-400 text-sm">
                    Founder TechStart
                  </p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400 italic">
                "Forecast AI-nya sangat akurat! Kami bisa memprediksi trend
                pasar dan menyiapkan strategi dengan lebih baik. Platform ini
                menjadi backbone bisnis kami."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        id="contact"
        className="py-20 px-6 bg-linear-to-r from-green-600 to-emerald-600 dark:from-green-700 dark:to-emerald-700"
      >
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Siap Mengoptimalkan Bisnis Anda?
          </h2>
          <p className="text-green-100 text-xl mb-8 max-w-2xl mx-auto">
            Bergabung dengan ratusan bisnis yang sudah mengalami transformasi
            digital dan mencapai pertumbuhan yang signifikan dengan PlanWeb.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-white text-green-600 px-8 py-4 rounded-lg hover:bg-gray-100 transition-all duration-200 font-bold text-lg inline-flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Mulai Gratis Sekarang
              <ArrowRight className="ml-2" size={20} />
            </Link>
            <Link
              to="/login"
              className="border-2 border-white text-white px-8 py-4 rounded-lg hover:bg-white hover:text-green-600 transition-all duration-200 font-bold text-lg"
            >
              Masuk ke Akun
            </Link>
          </div>
          <p className="text-green-200 mt-4 text-sm">
            Tidak perlu kartu kredit • Akses penuh 14 hari • Setup dalam 5 menit
          </p>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default LandingPage;
