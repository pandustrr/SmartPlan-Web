import React, { useState, useRef } from 'react';
import { Download, Loader, AlertCircle } from 'lucide-react';
import jsPDF from 'jspdf';
import { toast } from 'react-toastify';
import html2canvas from 'html2canvas';

const ForecastExportPDF = ({ forecastData, generatedResults, chartRefs = {} }) => {
    const [isExporting, setIsExporting] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const getMonthName = (monthNumber) => {
        const months = ['', 'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 
                       'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
        return months[monthNumber] || '-';
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value);
    };

    const formatPercentage = (value) => {
        return `${parseFloat(value).toFixed(2)}%`;
    };

    const exportToPDF = async () => {
        try {
            setIsExporting(true);

            const doc = new jsPDF();
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();
            let yPosition = 20;

            // Header - Title
            doc.setFontSize(20);
            doc.setTextColor(30, 41, 59);
            doc.text('Laporan Forecast Keuangan', pageWidth / 2, yPosition, { align: 'center' });
            yPosition += 10;

            // Subtitle with date
            doc.setFontSize(11);
            doc.setTextColor(100, 116, 139);
            const generatedDate = new Date().toLocaleDateString('id-ID', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            doc.text(`Dihasilkan: ${generatedDate}`, pageWidth / 2, yPosition, { align: 'center' });
            yPosition += 15;

            // Forecast Info
            doc.setFontSize(12);
            doc.setTextColor(30, 41, 59);
            doc.text('Informasi Forecast', 15, yPosition);
            yPosition += 8;

            doc.setFontSize(10);
            doc.setTextColor(71, 85, 105);
            const forecastType = !forecastData.month || forecastData.month === null ? 'Forecast Tahun' : `Forecast ${getMonthName(forecastData.month)}`;
            doc.text(`Tipe: ${forecastType} ${forecastData.year}`, 20, yPosition);
            yPosition += 6;
            doc.text(`Dibuat: ${new Date(forecastData.created_at).toLocaleDateString('id-ID')}`, 20, yPosition);
            yPosition += 10;

            // Annual Summary
            if (generatedResults?.annual_summary) {
                const summary = generatedResults.annual_summary;
                
                doc.setFontSize(12);
                doc.setTextColor(30, 41, 59);
                doc.text('Ringkasan Tahunan', 15, yPosition);
                yPosition += 8;

                // Draw table manually
                const colWidth = 85;
                const rowHeight = 7;
                const startX = 15;

                // Header
                doc.setFillColor(59, 130, 246);
                doc.setTextColor(255, 255, 255);
                doc.rect(startX, yPosition, colWidth, rowHeight, 'F');
                doc.rect(startX + colWidth, yPosition, colWidth, rowHeight, 'F');
                doc.setFontSize(9);
                doc.setFont(undefined, 'bold');
                doc.text('Metrik', startX + 2, yPosition + 5);
                doc.text('Nilai', startX + colWidth + 2, yPosition + 5);
                yPosition += rowHeight;

                // Data rows
                doc.setFont(undefined, 'normal');
                doc.setTextColor(71, 85, 105);
                const summaryRows = [
                    ['Total Pendapatan', String(formatCurrency(summary.total_income || 0))],
                    ['Total Pengeluaran', String(formatCurrency(summary.total_expense || 0))],
                    ['Total Laba', String(formatCurrency(summary.total_profit || 0))],
                    ['Rata-rata Margin', String(formatPercentage(summary.avg_margin || 0))],
                    ['Rata-rata Confidence', String(formatPercentage(summary.avg_confidence || 0))]
                ];

                summaryRows.forEach((row, idx) => {
                    if (idx % 2 === 1) {
                        doc.setFillColor(241, 245, 249);
                        doc.rect(startX, yPosition, colWidth * 2, rowHeight, 'F');
                    }
                    doc.text(String(row[0]), startX + 2, yPosition + 5);
                    doc.text(String(row[1]), startX + colWidth + 2, yPosition + 5);
                    doc.rect(startX, yPosition, colWidth, rowHeight);
                    doc.rect(startX + colWidth, yPosition, colWidth, rowHeight);
                    yPosition += rowHeight;
                });

                yPosition += 5;
            }

            // Forecast Results Table
            if (generatedResults?.results && generatedResults.results.length > 0) {
                // Check if new page is needed
                if (yPosition > pageHeight - 60) {
                    doc.addPage();
                    yPosition = 20;
                }

                doc.setFontSize(12);
                doc.setTextColor(30, 41, 59);
                doc.text('Detail Forecast Bulanan', 15, yPosition);
                yPosition += 8;

                // Table headers
                const headers = ['Bulan', 'Pendapatan', 'Pengeluaran', 'Laba', 'Margin', 'Conf'];
                const colWidths = [20, 28, 28, 25, 22, 22];
                const rowHeight = 6;
                let currentX = 15;

                doc.setFillColor(79, 70, 229);
                doc.setTextColor(255, 255, 255);
                doc.setFontSize(8);
                doc.setFont(undefined, 'bold');

                headers.forEach((header, idx) => {
                    doc.rect(currentX, yPosition, colWidths[idx], rowHeight, 'F');
                    doc.text(header, currentX + 1, yPosition + 4);
                    currentX += colWidths[idx];
                });
                yPosition += rowHeight;

                // Table data
                doc.setFont(undefined, 'normal');
                doc.setTextColor(71, 85, 105);
                doc.setFontSize(7);

                generatedResults.results.forEach((result, rowIdx) => {
                    if (yPosition > pageHeight - 20) {
                        doc.addPage();
                        yPosition = 20;
                    }

                    currentX = 15;
                    if (rowIdx % 2 === 1) {
                        doc.setFillColor(241, 245, 249);
                        doc.rect(15, yPosition, 165, rowHeight, 'F');
                    }

                    const rowData = [
                        String(result.month || '-'),
                        String(formatCurrency(result.forecast_income || 0)),
                        String(formatCurrency(result.forecast_expense || 0)),
                        String(formatCurrency(result.forecast_profit || 0)),
                        String(formatPercentage(result.forecast_margin || 0)),
                        String(formatPercentage(result.confidence_level || 0))
                    ];

                    rowData.forEach((data, idx) => {
                        doc.text(String(data), currentX + 1, yPosition + 4);
                        doc.rect(currentX, yPosition, colWidths[idx], rowHeight);
                        currentX += colWidths[idx];
                    });

                    yPosition += rowHeight;
                });

                yPosition += 5;
            }

            // Charts Section
            if (chartRefs.income || chartRefs.expense || chartRefs.profit) {
                // Check if new page is needed
                if (yPosition > pageHeight - 100) {
                    doc.addPage();
                    yPosition = 20;
                }

                doc.setFontSize(12);
                doc.setTextColor(30, 41, 59);
                doc.text('Grafik Prediksi Keuangan', 15, yPosition);
                yPosition += 10;

                // Capture charts
                const chartNames = ['income', 'expense', 'profit'];
                const chartImages = {};

                for (const chartName of chartNames) {
                    const chartRef = chartRefs[chartName];
                    const chartElement = chartRef?.current;
                    
                    if (chartElement) {
                        try {
                            // Create a wrapper with white background
                            const wrapper = document.createElement('div');
                            wrapper.style.position = 'absolute';
                            wrapper.style.left = '-9999px';
                            wrapper.style.top = '-9999px';
                            wrapper.style.backgroundColor = 'white';
                            wrapper.style.padding = '30px 40px';
                            wrapper.style.width = '900px';
                            wrapper.style.borderRadius = '8px';
                            wrapper.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
                            wrapper.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif';
                            
                            // Clone the chart element
                            const clonedChart = chartElement.cloneNode(true);
                            
                            // Remove dark mode classes and add light background
                            const cleanElement = (el) => {
                                if (el.classList) {
                                    el.classList.remove('dark');
                                    // Remove dark: prefixed classes
                                    Array.from(el.classList).forEach(cls => {
                                        if (cls.includes('dark:')) {
                                            el.classList.remove(cls);
                                        }
                                    });
                                }
                                // Force light colors for text and backgrounds
                                el.style.color = 'rgb(0, 0, 0)';
                                el.style.backgroundColor = 'rgb(255, 255, 255)';
                                
                                // Process SVG elements
                                if (el.tagName === 'svg') {
                                    el.style.backgroundColor = 'white';
                                }
                                
                                // Recursively process children
                                Array.from(el.children).forEach(child => cleanElement(child));
                            };
                            
                            cleanElement(clonedChart);
                            wrapper.appendChild(clonedChart);
                            document.body.appendChild(wrapper);
                            
                            // Wait for rendering
                            await new Promise(resolve => setTimeout(resolve, 300));
                            
                            // Capture with specific settings for better quality
                            const canvas = await html2canvas(wrapper, {
                                scale: 2.5,
                                useCORS: true,
                                logging: false,
                                backgroundColor: '#ffffff',
                                allowTaint: true,
                                foreignObjectRendering: false,
                                imageTimeout: 8000,
                                width: 900,
                                height: 400,
                                windowHeight: 400,
                                windowWidth: 900
                            });
                            
                            chartImages[chartName] = canvas.toDataURL('image/png', 1.0);
                            document.body.removeChild(wrapper);
                        } catch (err) {
                            console.warn(`Failed to capture ${chartName} chart:`, err);
                            // Try fallback without clone
                            try {
                                const canvas = await html2canvas(chartElement, {
                                    scale: 2,
                                    useCORS: true,
                                    logging: false,
                                    backgroundColor: '#ffffff',
                                    allowTaint: true
                                });
                                chartImages[chartName] = canvas.toDataURL('image/png');
                            } catch (fallbackErr) {
                                console.warn(`Fallback also failed for ${chartName}:`, fallbackErr);
                            }
                        }
                    }
                }

                // Add charts to PDF
                let chartsPerPage = 0;
                const chartLabels = {
                    income: 'Prediksi Pendapatan',
                    expense: 'Prediksi Pengeluaran',
                    profit: 'Prediksi Laba'
                };

                for (const [chartName, imageData] of Object.entries(chartImages)) {
                    if (yPosition > pageHeight - 90) {
                        doc.addPage();
                        yPosition = 20;
                        chartsPerPage = 0;
                    }

                    // Add chart label with better styling
                    doc.setFontSize(11);
                    doc.setFont(undefined, 'bold');
                    doc.setTextColor(30, 41, 59);
                    doc.text(chartLabels[chartName], 15, yPosition);
                    yPosition += 7;

                    // Add chart image with better proportions
                    doc.addImage(imageData, 'PNG', 10, yPosition, 190, 75);
                    yPosition += 80;
                    chartsPerPage++;
                }

                yPosition += 5;
            }

            // Insights Section
            if (generatedResults?.insights && generatedResults.insights.length > 0) {
                // Check if new page is needed
                if (yPosition > pageHeight - 60) {
                    doc.addPage();
                    yPosition = 20;
                }

                doc.setFontSize(12);
                doc.setTextColor(30, 41, 59);
                doc.text('Insights & Rekomendasi', 15, yPosition);
                yPosition += 8;

                generatedResults.insights.forEach((insight, index) => {
                    // Check if new page is needed
                    if (yPosition > pageHeight - 40) {
                        doc.addPage();
                        yPosition = 20;
                    }

                    // Insight title
                    doc.setFontSize(9);
                    doc.setTextColor(30, 41, 59);
                    doc.setFont(undefined, 'bold');
                    doc.text(`${index + 1}. ${insight.title || 'Insight'}`, 20, yPosition);
                    yPosition += 5;

                    // Insight description
                    doc.setFontSize(8);
                    doc.setFont(undefined, 'normal');
                    doc.setTextColor(71, 85, 105);
                    const wrappedText = doc.splitTextToSize(insight.description || '', pageWidth - 40);
                    doc.text(wrappedText, 20, yPosition);
                    yPosition += wrappedText.length * 4 + 3;
                });
            }

            // Footer
            const totalPages = doc.internal.getNumberOfPages();
            for (let i = 1; i <= totalPages; i++) {
                doc.setPage(i);
                doc.setFontSize(8);
                doc.setTextColor(148, 163, 184);
                doc.text(
                    `Halaman ${i} dari ${totalPages}`,
                    pageWidth / 2,
                    pageHeight - 10,
                    { align: 'center' }
                );
            }

            // Save PDF
            const fileName = `Forecast_${forecastData.year}_${new Date().getTime()}.pdf`;
            doc.save(fileName);

            toast.success('PDF berhasil diunduh!');
            setShowModal(false);
        } catch (error) {
            console.error('Error exporting PDF:', error);
            toast.error('Gagal mengunduh PDF. Silakan coba lagi.');
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <>
            {/* Export Button */}
            <button
                onClick={() => setShowModal(true)}
                disabled={isExporting}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors duration-200 font-medium text-sm"
            >
                <Download size={16} />
                {isExporting ? 'Mengunduh...' : 'Export PDF'}
            </button>

            {/* Confirmation Modal */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-6 max-w-md w-full mx-4">
                        <div className="flex items-start gap-3 mb-4">
                            <AlertCircle 
                                size={24} 
                                className="text-blue-500 flex-shrink-0"
                            />
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Export PDF Forecast
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm">
                                    Apakah Anda ingin mengunduh laporan forecast ini dalam format PDF?
                                </p>
                            </div>
                        </div>
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setShowModal(false)}
                                disabled={isExporting}
                                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg transition-colors font-medium text-sm disabled:opacity-50"
                            >
                                Batal
                            </button>
                            <button
                                onClick={exportToPDF}
                                disabled={isExporting}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors font-medium text-sm inline-flex items-center gap-2 disabled:opacity-50"
                            >
                                {isExporting ? (
                                    <>
                                        <Loader size={16} className="animate-spin" />
                                        Mengunduh...
                                    </>
                                ) : (
                                    <>
                                        <Download size={16} />
                                        Unduh
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ForecastExportPDF;
