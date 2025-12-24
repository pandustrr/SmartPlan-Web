import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { BarChart3, DollarSign, TrendingUp, Shield, Users, Rocket, CheckCircle, ArrowRight, LineChart, Target, Zap, Calendar, FileText, Star, ChevronLeft, ChevronRight } from "lucide-react";
import Navbar from "../components/Layout/Navbar";
import Footer from "../components/Layout/Footer";

function LandingPage({ isDarkMode, toggleDarkMode }) {
  const features = [
    {
      icon: BarChart3,
      title: "Analisis Bisnis Mendalam",
      description: "Dapatkan insight mendalam tentang performa bisnis Anda dengan analisis data yang powerful dan real-time. Pantau KPI dan metrik penting dalam satu dashboard.",
    },
    {
      icon: DollarSign,
      title: "Manajemen Keuangan",
      description: "Kelola keuangan bisnis dengan mudah, pantau pendapatan dan pengeluaran secara real-time dengan dashboard yang intuitif dan laporan otomatis.",
    },
    {
      icon: TrendingUp,
      title: "Forecast & Prediksi AI",
      description: "Prediksi masa depan bisnis Anda dengan algoritma AI yang akurat untuk perencanaan yang lebih baik dan pengambilan keputusan yang tepat.",
    },
    {
      icon: LineChart,
      title: "Laporan Otomatis",
      description: "Generate laporan bisnis otomatis dengan visualisasi data yang mudah dipahami. Export dalam berbagai format untuk presentasi dan analisis.",
    },
    {
      icon: Target,
      title: "Perencanaan Strategis",
      description: "Buat dan kelola rencana bisnis dengan tools yang membantu Anda mencapai target dengan efisien. Tetapkan goals dan track progress secara real-time.",
    },
    {
      icon: Calendar,
      title: "Manajemen Proyek",
      description: "Kelola proyek bisnis dengan timeline yang jelas, assign tugas ke tim, dan pantau progress secara real-time untuk memastikan semuanya berjalan sesuai rencana.",
    },
  ];

  const benefits = [
    {
      icon: Shield,
      title: "Keamanan Data Terjamin",
      description: "Data bisnis Anda dilindungi dengan enkripsi tingkat enterprise dan backup otomatis.",
    },
    {
      icon: Users,
      title: "Kolaborasi Tim Mudah",
      description: "Bekerjasama dengan tim secara efisien dengan tools kolaborasi yang terintegrasi.",
    },
    {
      icon: Rocket,
      title: "Implementasi Cepat",
      description: "Mulai gunakan platform dalam hitungan menit tanpa setup yang rumit.",
    },
    {
      icon: FileText,
      title: "Dukungan 24/7",
      description: "Tim support kami siap membantu kapanpun Anda membutuhkan bantuan.",
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <style>{`
        /* Color Palette Variables */
        :root {
          --primary-green: #167814;
          --dark-green: #084404;
          --accent-green: #10B517;
        }
        
        @media (prefers-color-scheme: dark) {
          :root {
            --primary-green: #10B517;
            --dark-green: #167814;
            --accent-green: #0d9414;
          }
        }

        /* Custom Green Utilities */
        .custom-green { color: var(--primary-green) !important; }
        .custom-green-dark { color: var(--dark-green) !important; }
        .custom-green-accent { color: var(--accent-green) !important; }
        .custom-green-bg { background-color: rgba(22, 120, 20, 0.08) !important; }
        .custom-green-bg-solid { background-color: var(--primary-green) !important; }
        .custom-green-border { border-color: var(--primary-green) !important; }
        .custom-green-border:hover { border-color: var(--accent-green) !important; }
        
        @media (prefers-color-scheme: dark) {
          .custom-green-bg { background-color: rgba(16, 181, 23, 0.15) !important; }
          .custom-green-bg-solid { background-color: var(--primary-green) !important; }
        }

        /* Smooth Animations */
        .animate-fade-in {
          animation: fadeIn 0.6s ease-in;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Professional Hover Effects */
        .hover-lift {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .hover-lift:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }
      `}</style>
      {/* Navigation */}
      <Navbar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />

      {/* Hero Section - Corporate Professional */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden">
        {/* Background Image (Optional - if office-bg.jpg exists) */}
        <div className="absolute inset-0 opacity-[0.08] dark:opacity-[0.12]">
          <img src="/assets/images/office-bg.jpg" alt="" className="w-full h-full object-cover" onError={(e) => (e.target.style.display = "none")} />
        </div>

        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5 dark:opacity-10">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full" style={{ background: "radial-gradient(circle, #167814 0%, transparent 70%)" }}></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full" style={{ background: "radial-gradient(circle, #10B517 0%, transparent 70%)" }}></div>
        </div>

        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Column - Content */}
            <div className="text-left animate-fade-in">
              <div className="inline-flex items-center px-5 py-2.5 rounded-full text-sm font-bold mb-8 border-2 custom-green-border custom-green bg-white dark:bg-gray-800">
                <Zap className="w-4 h-4 mr-2" />
                PLATFORM MANAJEMEN BISNIS #1
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 dark:text-white mb-6 leading-[1.1] tracking-tight">
                Kelola Bisnis
                <span className="block mt-2" style={{ color: isDarkMode ? "#10B517" : "#167814" }}>
                  Lebih Cerdas
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-10 leading-relaxed font-light">
                Platform all-in-one untuk perencanaan strategis, analisis keuangan, dan prediksi AI.
                <span className="block mt-2 font-semibold text-gray-900 dark:text-white">Semua dalam satu solusi terintegrasi.</span>
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <Link
                  to="/register"
                  className="group px-10 py-5 rounded-xl font-bold text-lg inline-flex items-center justify-center transition-all duration-300 transform hover:scale-105 text-white shadow-xl hover:shadow-2xl"
                  style={{ backgroundColor: isDarkMode ? "#10B517" : "#167814" }}
                >
                  Mulai Gratis Sekarang
                  <ArrowRight className="ml-3 group-hover:translate-x-1 transition-transform" size={20} />
                </Link>
                <Link
                  to="#features"
                  className="px-10 py-5 rounded-xl font-bold text-lg inline-flex items-center justify-center transition-all duration-300 border-2 hover:scale-105"
                  style={{
                    borderColor: isDarkMode ? "#10B517" : "#167814",
                    color: isDarkMode ? "#10B517" : "#167814",
                  }}
                >
                  Lihat Fitur
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center gap-8 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <CheckCircle size={18} className="custom-green" />
                  <span className="font-semibold">Akses Tanpa Batas</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={18} className="custom-green" />
                  <span className="font-semibold">Setup Instant</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={18} className="custom-green" />
                  <span className="font-semibold">500+ Bisnis Bergabung</span>
                </div>
              </div>
            </div>

            {/* Right Column - Carousel Mockup Laptop */}
            <div className="relative lg:block hidden animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <MockupCarousel isDarkMode={isDarkMode} />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Modern Grid */}
      <section id="features" className="py-24 px-6 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-20">
            <div className="inline-block px-6 py-2 rounded-full text-sm font-bold mb-6 custom-green-bg custom-green uppercase tracking-wider">Fitur Unggulan</div>
            <h2 className="text-5xl md:text-6xl font-black text-gray-900 dark:text-white mb-6 tracking-tight">
              Platform Lengkap untuk
              <span className="block mt-2" style={{ color: isDarkMode ? "#10B517" : "#167814" }}>
                Kesuksesan Bisnis Anda
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">Dari perencanaan hingga eksekusi - semua tools yang Anda butuhkan dalam satu dashboard terintegrasi</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="group bg-white dark:bg-gray-800 p-8 rounded-2xl hover-lift border-2 border-gray-200 dark:border-gray-700 hover:border-opacity-0 relative overflow-hidden">
                  {/* Hover gradient overlay */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: `linear-gradient(135deg, transparent 0%, ${isDarkMode ? "rgba(16, 181, 23, 0.05)" : "rgba(22, 120, 20, 0.05)"} 100%)` }}
                  ></div>

                  <div className="relative z-10">
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-300"
                      style={{ backgroundColor: isDarkMode ? "rgba(16, 181, 23, 0.15)" : "rgba(22, 120, 20, 0.1)" }}
                    >
                      <Icon className="custom-green" size={32} strokeWidth={2.5} />
                    </div>
                    <h3 className="text-xl font-black text-gray-900 dark:text-white mb-4 group-hover:custom-green transition-colors duration-300">{feature.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section - Bold Layout */}
      <section id="about" className="py-24 px-6 bg-white dark:bg-gray-800">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black text-gray-900 dark:text-white mb-6 tracking-tight">
              Mengapa Memilih
              <span className="block mt-2" style={{ color: isDarkMode ? "#10B517" : "#167814" }}>
                Grapadi Strategix?
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">Komitmen kami adalah kesuksesan bisnis Anda dengan teknologi terdepan dan support terbaik</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={index}
                  className="group text-center p-8 rounded-2xl bg-gray-50 dark:bg-gray-700 hover-lift border-2 border-transparent hover:border-opacity-100"
                  style={{ borderColor: isDarkMode ? "rgba(16, 181, 23, 0)" : "rgba(22, 120, 20, 0)" }}
                >
                  <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-all duration-300 shadow-lg" style={{ backgroundColor: isDarkMode ? "#10B517" : "#167814" }}>
                    <Icon className="text-white" size={36} strokeWidth={2.5} />
                  </div>
                  <h3 className="text-xl font-black text-gray-900 dark:text-white mb-4">{benefit.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Section - Value Propositions */}
      <section className="py-24 px-6 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-20">
            <div className="inline-block px-6 py-2 rounded-full text-sm font-bold mb-6 custom-green-bg custom-green uppercase tracking-wider">Keunggulan Kompetitif</div>
            <h2 className="text-5xl md:text-6xl font-black text-gray-900 dark:text-white mb-6 tracking-tight">
              Teknologi & Inovasi untuk
              <span className="block mt-2" style={{ color: isDarkMode ? "#10B517" : "#167814" }}>
                Pertumbuhan Bisnis Anda
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Value 1 - AI Analytics */}
            <div className="group relative bg-white dark:bg-gray-800 p-10 rounded-3xl border-2 border-gray-200 dark:border-gray-700 hover-lift overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 opacity-10" style={{ background: `radial-gradient(circle, ${isDarkMode ? "#10B517" : "#167814"} 0%, transparent 70%)` }}></div>
              <div className="relative z-10">
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-300 shadow-lg" style={{ backgroundColor: isDarkMode ? "#10B517" : "#167814" }}>
                  <Zap className="w-10 h-10 text-white" strokeWidth={2.5} />
                </div>
                <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-4">AI-Powered Analytics</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6 text-lg">
                  Manfaatkan kekuatan Artificial Intelligence untuk analisis bisnis yang lebih akurat. Algoritma kami terus belajar dari data untuk memberikan insight yang relevan.
                </p>
                <div className="flex items-center gap-3 text-base font-bold" style={{ color: isDarkMode ? "#10B517" : "#167814" }}>
                  <TrendingUp size={24} strokeWidth={2.5} />
                  <span>95% akurasi prediksi</span>
                </div>
              </div>
            </div>

            {/* Value 2 - All-in-One */}
            <div className="group relative bg-white dark:bg-gray-800 p-10 rounded-3xl border-2 border-gray-200 dark:border-gray-700 hover-lift overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 opacity-10" style={{ background: `radial-gradient(circle, ${isDarkMode ? "#10B517" : "#167814"} 0%, transparent 70%)` }}></div>
              <div className="relative z-10">
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-300 shadow-lg" style={{ backgroundColor: isDarkMode ? "#10B517" : "#167814" }}>
                  <Target className="w-10 h-10 text-white" strokeWidth={2.5} />
                </div>
                <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-4">All-in-One Platform</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6 text-lg">Satu platform untuk semua kebutuhan. Dari perencanaan strategis hingga forecast dan reporting - semua terintegrasi dalam satu dashboard.</p>
                <div className="flex items-center gap-3 text-base font-bold" style={{ color: isDarkMode ? "#10B517" : "#167814" }}>
                  <CheckCircle size={24} strokeWidth={2.5} />
                  <span>10+ modul terintegrasi</span>
                </div>
              </div>
            </div>

            {/* Value 3 - Security */}
            <div className="group relative bg-white dark:bg-gray-800 p-10 rounded-3xl border-2 border-gray-200 dark:border-gray-700 hover-lift overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 opacity-10" style={{ background: `radial-gradient(circle, ${isDarkMode ? "#10B517" : "#167814"} 0%, transparent 70%)` }}></div>
              <div className="relative z-10">
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-300 shadow-lg" style={{ backgroundColor: isDarkMode ? "#10B517" : "#167814" }}>
                  <Shield className="w-10 h-10 text-white" strokeWidth={2.5} />
                </div>
                <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-4">Enterprise Security</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6 text-lg">Data bisnis Anda dilindungi dengan enkripsi tingkat enterprise, backup otomatis, dan infrastruktur cloud terpercaya 24/7.</p>
                <div className="flex items-center gap-3 text-base font-bold" style={{ color: isDarkMode ? "#10B517" : "#167814" }}>
                  <Shield size={24} strokeWidth={2.5} />
                  <span>ISO 27001 Certified</span>
                </div>
              </div>
            </div>

            {/* Value 4 - Support */}
            <div className="group relative bg-white dark:bg-gray-800 p-10 rounded-3xl border-2 border-gray-200 dark:border-gray-700 hover-lift overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 opacity-10" style={{ background: `radial-gradient(circle, ${isDarkMode ? "#10B517" : "#167814"} 0%, transparent 70%)` }}></div>
              <div className="relative z-10">
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-300 shadow-lg" style={{ backgroundColor: isDarkMode ? "#10B517" : "#167814" }}>
                  <Users className="w-10 h-10 text-white" strokeWidth={2.5} />
                </div>
                <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-4">Expert Support 24/7</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6 text-lg">Tim support berpengalaman siap membantu kapan saja. Live chat, email, atau phone support dengan respons dalam 30 menit.</p>
                <div className="flex items-center gap-3 text-base font-bold" style={{ color: isDarkMode ? "#10B517" : "#167814" }}>
                  <Star size={24} strokeWidth={2.5} />
                  <span>4.9/5 rating kepuasan</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Section - Bold Numbers */}
          <div className="mt-20 pt-16 border-t-2 border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center group hover-lift p-6 rounded-2xl">
                <div className="text-6xl font-black mb-3" style={{ color: isDarkMode ? "#10B517" : "#167814" }}>
                  500+
                </div>
                <div className="text-gray-600 dark:text-gray-400 font-bold text-lg">Bisnis Terdaftar</div>
              </div>
              <div className="text-center group hover-lift p-6 rounded-2xl">
                <div className="text-6xl font-black mb-3" style={{ color: isDarkMode ? "#10B517" : "#167814" }}>
                  50K+
                </div>
                <div className="text-gray-600 dark:text-gray-400 font-bold text-lg">Business Plans</div>
              </div>
              <div className="text-center group hover-lift p-6 rounded-2xl">
                <div className="text-6xl font-black mb-3" style={{ color: isDarkMode ? "#10B517" : "#167814" }}>
                  40%
                </div>
                <div className="text-gray-600 dark:text-gray-400 font-bold text-lg">Peningkatan Efisiensi</div>
              </div>
              <div className="text-center group hover-lift p-6 rounded-2xl">
                <div className="text-6xl font-black mb-3" style={{ color: isDarkMode ? "#10B517" : "#167814" }}>
                  99.9%
                </div>
                <div className="text-gray-600 dark:text-gray-400 font-bold text-lg">Uptime Guarantee</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Bold & Professional */}
      <section
        id="contact"
        className="relative py-20 px-6 overflow-hidden"
        style={{ background: isDarkMode ? "linear-gradient(135deg, #084404 0%, #167814 50%, #10B517 100%)" : "linear-gradient(135deg, #084404 0%, #167814 50%, #10B517 100%)" }}
      >
        {/* Optional Background Image */}
        <div className="absolute inset-0 opacity-20">
          <img src="/assets/images/office-bg-2.jpg" alt="" className="w-full h-full object-cover mix-blend-overlay" onError={(e) => (e.target.style.display = "none")} />
        </div>

        {/* Geometric Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 border-4 border-white rounded-3xl transform rotate-12"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 border-4 border-white rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 border-4 border-white rounded-3xl rotate-45"></div>
        </div>

        <div className="container mx-auto max-w-5xl relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-black mb-8 uppercase tracking-wider">
              <Rocket className="w-5 h-5 mr-2" />
              Mulai Transformasi Digital Anda
            </div>

            <h2 className="text-5xl md:text-7xl font-black text-white mb-8 leading-tight tracking-tight">
              Siap Mengoptimalkan
              <span className="block mt-2">Bisnis Anda?</span>
            </h2>

            <p className="text-2xl mb-12 max-w-3xl mx-auto text-white/95 leading-relaxed font-light">
              Bergabung dengan <span className="font-black">500+ bisnis</span> yang sudah mencapai pertumbuhan signifikan dengan Grapadi Strategix
            </p>

            {/* CTA Buttons - Bold Design */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
              <Link
                to="/register"
                className="group bg-white px-12 py-6 rounded-2xl hover:bg-gray-50 transition-all duration-300 font-black text-xl inline-flex items-center justify-center shadow-2xl transform hover:scale-105"
                style={{ color: "#167814" }}
              >
                <CheckCircle className="mr-3 group-hover:rotate-12 transition-transform" size={24} strokeWidth={3} />
                Mulai Gratis Sekarang
                <ArrowRight className="ml-3 group-hover:translate-x-2 transition-transform" size={24} strokeWidth={3} />
              </Link>
              <Link
                to="/login"
                className="group border-4 border-white text-white px-12 py-6 rounded-2xl transition-all duration-300 font-black text-xl backdrop-blur-sm bg-white/10 hover:bg-white hover:scale-105 transform"
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "white";
                  e.currentTarget.style.color = "#167814";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)";
                  e.currentTarget.style.color = "white";
                }}
              >
                Masuk ke Akun
              </Link>
            </div>

            {/* Trust Indicators - Bold */}
            <div className="flex flex-wrap items-center justify-center gap-8 text-white text-base font-bold">
              <div className="flex items-center gap-3">
                <CheckCircle size={20} className="text-white" strokeWidth={3} />
                <span>Platform Terpercaya</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle size={20} className="text-white" strokeWidth={3} />
                <span>Data Aman & Terenkripsi</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle size={20} className="text-white" strokeWidth={3} />
                <span>Support 24/7</span>
              </div>
            </div>

            {/* Stats - Compact Version */}
            <div className="grid grid-cols-4 gap-8 mt-16 pt-16 border-t-2 border-white/20">
              {[
                { icon: Users, number: "500+", label: "Bisnis" },
                { icon: TrendingUp, number: "40%", label: "Efisiensi" },
                { icon: Star, number: "4.9/5", label: "Rating" },
                { icon: Zap, number: "24/7", label: "Support" },
              ].map((stat, idx) => {
                const Icon = stat.icon;
                return (
                  <div key={idx} className="text-center group">
                    <Icon className="w-10 h-10 text-white mx-auto mb-3 group-hover:scale-110 transition-transform" strokeWidth={2.5} />
                    <div className="text-4xl font-black text-white mb-2">{stat.number}</div>
                    <div className="text-sm text-white/80 font-bold uppercase tracking-wider">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}

// Carousel Component for Laptop Mockups
function MockupCarousel({ isDarkMode }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = 5;

  // Auto-play carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="relative w-full h-[500px] group">
      {/* Mockup Images */}
      <div className="relative w-full h-full overflow-hidden">
        {[1, 2, 3, 4, 5].map((num, index) => (
          <div
            key={num}
            className={`absolute inset-0 transition-all duration-700 ease-in-out ${
              index === currentSlide ? "opacity-100 translate-x-0 scale-100" : index < currentSlide ? "opacity-0 -translate-x-full scale-95" : "opacity-0 translate-x-full scale-95"
            }`}
          >
            <img
              src={`/assets/images/dashboard-mockup-${num}.png`}
              alt={`Dashboard Feature ${num}`}
              className="w-full h-full object-contain drop-shadow-2xl"
              onError={(e) => {
                // Fallback placeholder
                e.target.style.display = "none";
                e.target.nextSibling.style.display = "flex";
              }}
            />
            {/* Fallback Placeholder */}
            <div
              className="absolute inset-0 items-center justify-center"
              style={{
                display: "none",
                background: `linear-gradient(135deg, ${isDarkMode ? "#10B517" : "#167814"} 0%, ${isDarkMode ? "#0d9414" : "#084404"} 100%)`,
              }}
            >
              <div className="text-center text-white p-8">
                <BarChart3 size={80} className="mx-auto mb-4 opacity-80" />
                <p className="text-lg font-bold">Mockup {num}</p>
                <p className="text-sm opacity-80 mt-2">Upload: dashboard-mockup-{num}.png</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:scale-110 z-10"
        style={{ color: isDarkMode ? "#10B517" : "#167814" }}
      >
        <ChevronLeft size={24} strokeWidth={3} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:scale-110 z-10"
        style={{ color: isDarkMode ? "#10B517" : "#167814" }}
      >
        <ChevronRight size={24} strokeWidth={3} />
      </button>

      {/* Dots Indicator */}
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {[...Array(totalSlides)].map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentSlide ? "w-8" : "hover:opacity-75"}`}
            style={{
              backgroundColor: index === currentSlide ? (isDarkMode ? "#10B517" : "#167814") : isDarkMode ? "rgba(16, 181, 23, 0.3)" : "rgba(22, 120, 20, 0.3)",
            }}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default LandingPage;
