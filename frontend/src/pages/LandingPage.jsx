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
  Star,
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 dark:from-gray-900 dark:to-gray-800">
      <style>{`
        @media (prefers-color-scheme: dark) {
          .custom-green { color: #10b517 !important; }
          .custom-green-bg { background-color: rgba(16, 181, 23, 0.2) !important; }
          .custom-green-border:hover { border-color: rgba(16, 181, 23, 0.5) !important; }
        }
        @media (prefers-color-scheme: light) {
          .custom-green { color: #084404 !important; }
          .custom-green-bg { background-color: rgba(8, 68, 4, 0.15) !important; }
          .custom-green-border:hover { border-color: rgba(8, 68, 4, 0.3) !important; }
        }
      `}</style>
      {/* Navigation */}
      <Navbar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium mb-6 custom-green-bg custom-green">
              <Zap className="w-4 h-4 mr-2" />
              Platform Manajemen Bisnis
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              Kelola Bisnis Lebih
              <span className="block custom-green">
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
                className="text-white px-8 py-4 rounded-lg transition-all duration-200 font-medium text-lg inline-flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                style={{ backgroundColor: isDarkMode ? '#10b517' : '#084404' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = isDarkMode ? '#0d9414' : '#0a5505'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = isDarkMode ? '#10b517' : '#084404'}
              >
                Mulai Sekarang Gratis
                <ArrowRight className="ml-2" size={20} />
              </Link>
              <Link
                to="#features"
                className="border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-8 py-4 rounded-lg transition-all duration-200 font-medium text-lg hover:shadow-lg"
                onMouseEnter={(e) => e.currentTarget.style.borderColor = isDarkMode ? '#10b517' : '#084404'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = ''}
              >
                Pelajari Fitur
              </Link>
            </div>
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
                  className="bg-gray-50 dark:bg-gray-700 p-8 rounded-2xl hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-gray-600 group custom-green-border"
                >
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 custom-green-bg">
                    <Icon
                      className="custom-green"
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
              Mengapa Memilih Grapadi Strategix?
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
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300 custom-green-bg">
                    <Icon
                      className="custom-green"
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

      {/* Why Choose Grapadi Strategix Section */}
      <section className="py-20 px-6 bg-white dark:bg-gray-800 relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-green-100 dark:bg-green-900/20 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-100 dark:bg-blue-900/20 rounded-full blur-3xl opacity-30"></div>

        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium mb-6 custom-green-bg custom-green">
              <CheckCircle className="w-4 h-4 mr-2" />
              Keunggulan Kami
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Mengapa Memilih Grapadi Strategix?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Platform terpercaya dengan teknologi AI dan pengalaman mendalam dalam membantu bisnis mencapai kesuksesan
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Value 1 */}
            <div className="group relative bg-gradient-to-br from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 p-8 rounded-2xl border border-gray-200 dark:border-gray-600 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-400/20 to-transparent rounded-bl-full"></div>
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl custom-green-bg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Zap className="w-8 h-8 custom-green" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  AI-Powered Analytics
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                  Manfaatkan kekuatan Artificial Intelligence untuk analisis bisnis yang lebih akurat dan prediksi yang tepat.
                  Algoritma kami terus belajar dari data Anda untuk memberikan insight yang semakin relevan.
                </p>
                <div className="flex items-center gap-2 text-sm font-semibold custom-green">
                  <TrendingUp size={18} />
                  <span>95% akurasi prediksi</span>
                </div>
              </div>
            </div>

            {/* Value 2 */}
            <div className="group relative bg-gradient-to-br from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 p-8 rounded-2xl border border-gray-200 dark:border-gray-600 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-transparent rounded-bl-full"></div>
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl custom-green-bg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Target className="w-8 h-8 custom-green" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  All-in-One Platform
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                  Satu platform untuk semua kebutuhan manajemen bisnis Anda. Dari perencanaan strategis, analisis keuangan,
                  hingga forecast dan reporting - semua terintegrasi sempurna dalam satu dashboard.
                </p>
                <div className="flex items-center gap-2 text-sm font-semibold custom-green">
                  <CheckCircle size={18} />
                  <span>10+ modul terintegrasi</span>
                </div>
              </div>
            </div>

            {/* Value 3 */}
            <div className="group relative bg-gradient-to-br from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 p-8 rounded-2xl border border-gray-200 dark:border-gray-600 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-transparent rounded-bl-full"></div>
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl custom-green-bg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Shield className="w-8 h-8 custom-green" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Enterprise-Grade Security
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                  Data bisnis Anda adalah aset berharga. Kami menggunakan enkripsi tingkat enterprise, backup otomatis,
                  dan infrastruktur cloud terpercaya untuk menjamin keamanan data Anda 24/7.
                </p>
                <div className="flex items-center gap-2 text-sm font-semibold custom-green">
                  <Shield size={18} />
                  <span>ISO 27001 Certified</span>
                </div>
              </div>
            </div>

            {/* Value 4 */}
            <div className="group relative bg-gradient-to-br from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 p-8 rounded-2xl border border-gray-200 dark:border-gray-600 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-400/20 to-transparent rounded-bl-full"></div>
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl custom-green-bg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-8 h-8 custom-green" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Expert Support 24/7
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                  Tim support kami yang berpengalaman siap membantu Anda kapan saja. Dapatkan bantuan melalui live chat,
                  email, atau phone support. Kami berkomitmen untuk respons dalam 30 menit.
                </p>
                <div className="flex items-center gap-2 text-sm font-semibold custom-green">
                  <Star size={18} />
                  <span>4.9/5 rating kepuasan</span>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Trust Badges */}
          <div className="mt-16 pt-12 border-t border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="space-y-2">
                <div className="text-4xl font-bold custom-green">500+</div>
                <div className="text-gray-600 dark:text-gray-400 text-sm">Bisnis Terdaftar</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-bold custom-green">50K+</div>
                <div className="text-gray-600 dark:text-gray-400 text-sm">Business Plans Dibuat</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-bold custom-green">40%</div>
                <div className="text-gray-600 dark:text-gray-400 text-sm">Peningkatan Efisiensi</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-bold custom-green">99.9%</div>
                <div className="text-gray-600 dark:text-gray-400 text-sm">Uptime Guarantee</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Enhanced */}
      <section
        id="contact"
        className="relative py-24 px-6 overflow-hidden"
        style={{ background: isDarkMode ? 'linear-gradient(135deg, #10b517 0%, #0d9414 50%, #084404 100%)' : 'linear-gradient(135deg, #084404 0%, #0a5505 50%, #10b517 100%)' }}
      >
        {/* Animated Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="container mx-auto max-w-5xl relative z-10">
          {/* Main CTA Content */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-medium mb-6">
              <Rocket className="w-4 h-4 mr-2" />
              Bergabung Sekarang - Gratis!
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Siap Mengoptimalkan Bisnis Anda?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto text-white/90 leading-relaxed">
              Bergabung dengan <span className="font-bold">500+ bisnis</span> yang sudah mengalami transformasi digital dan mencapai pertumbuhan signifikan dengan Grapadi Strategix.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link
                to="/register"
                className="bg-white px-8 py-4 rounded-xl hover:bg-gray-100 transition-all duration-200 font-bold text-lg inline-flex items-center justify-center shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 hover:scale-105"
                style={{ color: isDarkMode ? '#10b517' : '#084404' }}
              >
                <CheckCircle className="mr-2" size={20} />
                Mulai Gratis Sekarang
                <ArrowRight className="ml-2" size={20} />
              </Link>
              <Link
                to="/login"
                className="border-2 border-white/80 text-white px-8 py-4 rounded-xl transition-all duration-200 font-bold text-lg backdrop-blur-sm bg-white/10 hover:bg-white hover:scale-105 transform"
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'white'; e.currentTarget.style.color = isDarkMode ? '#10b517' : '#084404' }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'white' }}
              >
                Masuk ke Akun
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-white/80 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle size={16} className="text-white" />
                <span>Tidak perlu kartu kredit</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={16} className="text-white" />
                <span>Akses penuh 14 hari</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={16} className="text-white" />
                <span>Setup dalam 5 menit</span>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
            {[
              { icon: Users, number: '500+', label: 'Bisnis Aktif' },
              { icon: TrendingUp, number: '40%', label: 'Avg. Efisiensi' },
              { icon: Star, number: '4.9/5', label: 'Rating Pengguna' },
              { icon: Zap, number: '24/7', label: 'Support' },
            ].map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-center hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-1">
                  <Icon className="w-8 h-8 text-white mx-auto mb-3" />
                  <div className="text-3xl font-bold text-white mb-1">{stat.number}</div>
                  <div className="text-sm text-white/80">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default LandingPage;
