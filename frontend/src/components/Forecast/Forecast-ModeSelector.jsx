import React from 'react';
import { Calendar, BarChart3, ArrowLeft } from 'lucide-react';

const ForecastModeSelector = ({ onSelectMode, onBack }) => {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <button
                    onClick={onBack}
                    className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                    <ArrowLeft size={24} className="text-gray-600 dark:text-gray-400" />
                </button>
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                        Pilih Jenis Forecast
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        Pilih apakah Anda ingin membuat forecast per tahun atau per bulan
                    </p>
                </div>
            </div>

            {/* Mode Selection Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Forecast Tahunan Card */}
                <button
                    onClick={() => onSelectMode('tahunan')}
                    className="group bg-white dark:bg-gray-800 rounded-xl shadow-sm border-2 border-gray-200 dark:border-gray-700 p-8 hover:shadow-lg hover:border-purple-400 dark:hover:border-purple-500 transition-all duration-300 text-left"
                >
                    <div className="flex flex-col h-full">
                        {/* Icon */}
                        <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                            <Calendar className="text-purple-600 dark:text-purple-400" size={32} />
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                                Forecast Tahunan
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">
                                Analisis prediksi keuangan untuk seluruh tahun dengan mengagregasi data dari semua bulan
                            </p>

                            {/* Features */}
                            <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                                <li className="flex items-center gap-2">
                                    <span className="inline-block w-1.5 h-1.5 bg-purple-600 dark:bg-purple-400 rounded-full"></span>
                                    Agregasi data seluruh tahun
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="inline-block w-1.5 h-1.5 bg-purple-600 dark:bg-purple-400 rounded-full"></span>
                                    Ringkasan pendapatan & pengeluaran
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="inline-block w-1.5 h-1.5 bg-purple-600 dark:bg-purple-400 rounded-full"></span>
                                    Insight tahunan & tren bisnis
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="inline-block w-1.5 h-1.5 bg-purple-600 dark:bg-purple-400 rounded-full"></span>
                                    Durasi prediksi: 3, 5, 10 tahun
                                </li>
                            </ul>
                        </div>

                        {/* CTA */}
                        <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-semibold mt-6 group-hover:gap-3 transition-all duration-300">
                            <span>Mulai Sekarang</span>
                            <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </div>
                </button>

                {/* Forecast Bulanan Card */}
                <button
                    onClick={() => onSelectMode('bulanan')}
                    className="group bg-white dark:bg-gray-800 rounded-xl shadow-sm border-2 border-gray-200 dark:border-gray-700 p-8 hover:shadow-lg hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-300 text-left"
                >
                    <div className="flex flex-col h-full">
                        {/* Icon */}
                        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                            <BarChart3 className="text-blue-600 dark:text-blue-400" size={32} />
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                                Forecast Bulanan
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">
                                Analisis prediksi keuangan untuk bulan-bulan tertentu dalam tahun yang dipilih
                            </p>

                            {/* Features */}
                            <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                                <li className="flex items-center gap-2">
                                    <span className="inline-block w-1.5 h-1.5 bg-blue-600 dark:bg-blue-400 rounded-full"></span>
                                    Analisis per bulan spesifik
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="inline-block w-1.5 h-1.5 bg-blue-600 dark:bg-blue-400 rounded-full"></span>
                                    Perbandingan antar bulan
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="inline-block w-1.5 h-1.5 bg-blue-600 dark:bg-blue-400 rounded-full"></span>
                                    Insight per bulan & risiko musiman
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="inline-block w-1.5 h-1.5 bg-blue-600 dark:bg-blue-400 rounded-full"></span>
                                    Durasi prediksi: 3, 6, 12, 24, 36 bulan
                                </li>
                            </ul>
                        </div>

                        {/* CTA */}
                        <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold mt-6 group-hover:gap-3 transition-all duration-300">
                            <span>Mulai Sekarang</span>
                            <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </div>
                </button>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 dark:border-blue-400 p-6 rounded-lg">
                <div className="flex gap-4">
                    <div className="flex-shrink-0">
                        <span className="text-2xl">💡</span>
                    </div>
                    <div>
                        <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
                            Perbedaan Forecast Tahunan vs Bulanan
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700 dark:text-blue-300">
                            <div>
                                <p className="font-medium mb-1">📅 Tahunan:</p>
                                <p>Cocok untuk perencanaan strategis jangka panjang dan analisis tren tahunan</p>
                            </div>
                            <div>
                                <p className="font-medium mb-1">📊 Bulanan:</p>
                                <p>Ideal untuk manajemen kas operasional dan strategi marketing per bulan</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForecastModeSelector;
