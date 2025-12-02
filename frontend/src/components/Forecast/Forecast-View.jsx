import React, { useState, useEffect, useRef } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AlertCircle, TrendingUp, TrendingDown, AlertTriangle, Zap, DollarSign, Percent } from 'lucide-react';
import ForecastExportPDF from './Forecast-ExportPDF';

const ForecastView = ({ forecastData, generatedResults, onBack }) => {
    const [results, setResults] = useState(null);
    const [insights, setInsights] = useState([]);
    const [annualSummary, setAnnualSummary] = useState(null);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('results');
    const chartRefs = {
        income: useRef(null),
        expense: useRef(null),
        profit: useRef(null)
    };

    useEffect(() => {
        if (generatedResults) {
            setResults(generatedResults.results || []);
            setInsights(generatedResults.insights || []);
            setAnnualSummary(generatedResults.annual_summary || null);
        }
    }, [generatedResults]);

    const getSeverityColor = (severity) => {
        switch (severity) {
            case 'critical':
                return 'bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 dark:border-red-400';
            case 'warning':
                return 'bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 dark:border-yellow-400';
            case 'positive':
                return 'bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 dark:border-green-400';
            default:
                return 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 dark:border-blue-400';
        }
    };

    const getSeverityIcon = (severity) => {
        switch (severity) {
            case 'critical':
                return <AlertTriangle size={20} className="text-red-500" />;
            case 'warning':
                return <AlertCircle size={20} className="text-yellow-500" />;
            case 'positive':
                return <TrendingUp size={20} className="text-green-500" />;
            default:
                return <AlertCircle size={20} />;
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                        Detail Forecast - Tahun {forecastData.year} Bulan {forecastData.month}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        Data historis: Pendapatan Rp {parseFloat(forecastData.income_sales).toLocaleString('id-ID')} | Pengeluaran Rp {parseFloat(forecastData.expense_operational).toLocaleString('id-ID')}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <ForecastExportPDF 
                        forecastData={forecastData}
                        generatedResults={generatedResults}
                        chartRefs={chartRefs}
                    />
                    <button
                        onClick={onBack}
                        className="px-4 py-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium flex items-center gap-2"
                    >
                        ← Kembali
                    </button>
                </div>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
                    <p className="text-gray-600 dark:text-gray-400">Memuat hasil forecast...</p>
                </div>
            )}

            {/* Tabs */}
            {!loading && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="flex border-b border-gray-200 dark:border-gray-700">
                    <button
                        onClick={() => setActiveTab('results')}
                        className={`flex-1 px-6 py-3 font-medium text-sm transition-colors duration-200 ${
                            activeTab === 'results'
                                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                        }`}
                    >
                        Hasil Forecast
                    </button>
                    <button
                        onClick={() => setActiveTab('insights')}
                        className={`flex-1 px-6 py-3 font-medium text-sm transition-colors duration-200 ${
                            activeTab === 'insights'
                                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                        }`}
                    >
                        Auto Insights
                    </button>
                    <button
                        onClick={() => setActiveTab('summary')}
                        className={`flex-1 px-6 py-3 font-medium text-sm transition-colors duration-200 ${
                            activeTab === 'summary'
                                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                        }`}
                    >
                        Ringkasan Tahunan
                    </button>
                </div>

                <div className="p-6">
                    {loading && !results ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <Loader size={32} className="text-blue-600 dark:text-blue-400 animate-spin mb-3" />
                            <p className="text-gray-600 dark:text-gray-400">Memuat hasil forecast...</p>
                        </div>
                    ) : !results ? (
                        <div className="text-center py-12">
                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                                Belum ada hasil forecast. Silakan generate forecast terlebih dahulu.
                            </p>
                        </div>
                    ) : (
                        <>
                            {/* Results Tab */}
                            {activeTab === 'results' && (
                                <div className="space-y-8">
                                    {/* Charts Grid */}
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        {/* Income Chart */}
                                        <div ref={chartRefs.income} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
                                            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Prediksi Pendapatan</h3>
                                            <ResponsiveContainer width="100%" height={250}>
                                                <LineChart data={results}>
                                                    <CartesianGrid strokeDasharray="3 3" />
                                                    <XAxis dataKey="month" />
                                                    <YAxis />
                                                    <Tooltip formatter={(value) => `Rp ${value.toLocaleString('id-ID')}`} />
                                                    <Line type="monotone" dataKey="forecast_income" stroke="#10b981" dot={false} />
                                                </LineChart>
                                            </ResponsiveContainer>
                                        </div>

                                        {/* Expense Chart */}
                                        <div ref={chartRefs.expense} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
                                            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Prediksi Pengeluaran</h3>
                                            <ResponsiveContainer width="100%" height={250}>
                                                <LineChart data={results}>
                                                    <CartesianGrid strokeDasharray="3 3" />
                                                    <XAxis dataKey="month" />
                                                    <YAxis />
                                                    <Tooltip formatter={(value) => `Rp ${value.toLocaleString('id-ID')}`} />
                                                    <Line type="monotone" dataKey="forecast_expense" stroke="#ef4444" dot={false} />
                                                </LineChart>
                                            </ResponsiveContainer>
                                        </div>

                                        {/* Profit Chart */}
                                        <div ref={chartRefs.profit} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
                                            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Prediksi Laba</h3>
                                            <ResponsiveContainer width="100%" height={250}>
                                                <BarChart data={results}>
                                                    <CartesianGrid strokeDasharray="3 3" />
                                                    <XAxis dataKey="month" />
                                                    <YAxis />
                                                    <Tooltip formatter={(value) => `Rp ${value.toLocaleString('id-ID')}`} />
                                                    <Bar dataKey="forecast_profit" fill="#3b82f6" />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>

                                        {/* Margin Chart */}
                                        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
                                            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Margin Profit</h3>
                                            <ResponsiveContainer width="100%" height={250}>
                                                <LineChart data={results}>
                                                    <CartesianGrid strokeDasharray="3 3" />
                                                    <XAxis dataKey="month" />
                                                    <YAxis />
                                                    <Tooltip formatter={(value) => `${value.toFixed(2)}%`} />
                                                    <Line type="monotone" dataKey="forecast_margin" stroke="#8b5cf6" dot={false} />
                                                </LineChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>

                                    {/* Results Table */}
                                    <div className="overflow-x-auto">
                                        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Tabel Detail Prediksi</h3>
                                        <table className="w-full">
                                            <thead className="bg-gray-50 dark:bg-gray-700/50">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Bulan</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Pendapatan</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Pengeluaran</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Laba</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Margin</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Confidence</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                                {results.map((result, idx) => (
                                                    <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                                        <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{result.month}</td>
                                                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">Rp {parseFloat(result.forecast_income).toLocaleString('id-ID')}</td>
                                                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">Rp {parseFloat(result.forecast_expense).toLocaleString('id-ID')}</td>
                                                        <td className={`px-6 py-4 text-sm font-medium ${parseFloat(result.forecast_profit) >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                                            Rp {parseFloat(result.forecast_profit).toLocaleString('id-ID')}
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{parseFloat(result.forecast_margin).toFixed(2)}%</td>
                                                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{parseFloat(result.confidence_level).toFixed(2)}%</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {/* Insights Tab */}
                            {activeTab === 'insights' && (
                                <div className="space-y-4">
                                    {insights.length === 0 ? (
                                        <p className="text-gray-600 dark:text-gray-400 py-8">Belum ada insights. Generate forecast terlebih dahulu.</p>
                                    ) : (
                                        insights.map((insight, idx) => (
                                            <div key={idx} className={`p-4 rounded-lg ${getSeverityColor(insight.severity)}`}>
                                                <div className="flex gap-3">
                                                    {getSeverityIcon(insight.severity)}
                                                    <div className="flex-1">
                                                        <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{insight.title}</h4>
                                                        <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">{insight.description}</p>
                                                        {insight.value && (
                                                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                                Nilai: <span className="text-blue-600 dark:text-blue-400">{insight.value}</span>
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}

                            {/* Summary Tab */}
                            {activeTab === 'summary' && annualSummary && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
                                        <div className="flex items-center gap-3 mb-2">
                                            <DollarSign size={24} />
                                            <p className="text-blue-100">Total Pendapatan Tahunan</p>
                                        </div>
                                        <p className="text-3xl font-bold">
                                            Rp {parseFloat(annualSummary.total_income).toLocaleString('id-ID')}
                                        </p>
                                    </div>

                                    <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg p-6 text-white">
                                        <div className="flex items-center gap-3 mb-2">
                                            <TrendingDown size={24} />
                                            <p className="text-red-100">Total Pengeluaran Tahunan</p>
                                        </div>
                                        <p className="text-3xl font-bold">
                                            Rp {parseFloat(annualSummary.total_expense).toLocaleString('id-ID')}
                                        </p>
                                    </div>

                                    <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white">
                                        <div className="flex items-center gap-3 mb-2">
                                            <TrendingUp size={24} />
                                            <p className="text-green-100">Total Laba Tahunan</p>
                                        </div>
                                        <p className="text-3xl font-bold">
                                            Rp {parseFloat(annualSummary.total_profit).toLocaleString('id-ID')}
                                        </p>
                                    </div>

                                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white">
                                        <div className="flex items-center gap-3 mb-2">
                                            <Percent size={24} />
                                            <p className="text-purple-100">Rata-rata Margin</p>
                                        </div>
                                        <p className="text-3xl font-bold">
                                            {parseFloat(annualSummary.avg_margin).toFixed(2)}%
                                        </p>
                                    </div>

                                    <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg p-6 text-white md:col-span-2">
                                        <div className="flex items-center gap-3 mb-2">
                                            <Zap size={24} />
                                            <p className="text-indigo-100">Rata-rata Kepercayaan Forecast</p>
                                        </div>
                                        <p className="text-3xl font-bold">
                                            {parseFloat(annualSummary.avg_confidence).toFixed(2)}%
                                        </p>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
            )}
        </div>
    );
};

export default ForecastView;
