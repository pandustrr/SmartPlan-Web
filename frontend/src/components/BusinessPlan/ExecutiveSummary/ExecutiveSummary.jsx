import { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import executiveSummaryApi from "../../../services/businessPlan/executiveSummaryApi";

export default function ExecutiveSummary() {
  const [summary, setSummary] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (user?.id) {
      executiveSummaryApi
        .getById(user.id)
        .then((res) => setSummary(res.data.data))
        .catch((err) =>
          console.error("Gagal memuat ringkasan eksekutif:", err)
        );
    }
  }, [user]);

  const generatePDF = (isPro = false) => {
    if (!summary) return;

    const doc = new jsPDF("p", "pt", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    doc.setFontSize(16);
    doc.text("RINGKASAN EKSEKUTIF", 40, 40);
    let y = 60;

    doc.setFontSize(12);
    const margin = 40;
    const lineHeight = 18; // tinggi baris

    // Fungsi bantu menulis teks dengan wrapping
    const writeText = (text, x, yStart) => {
      const lines = doc.splitTextToSize(text, pageWidth - margin * 2);
      doc.text(lines, x, yStart);
      return yStart + lines.length * lineHeight;
    };

    // Latar Belakang Usaha
    y = writeText("Latar Belakang Usaha:", margin, y);
    summary.business_overview.forEach((b) => {
      y = writeText(`Nama: ${b.name}`, margin, y);
      y = writeText(`Kategori: ${b.category}`, margin, y);
      y = writeText(`Deskripsi: ${b.description}`, margin, y);
      y += lineHeight / 2; // jarak ekstra antar item
    });

    // Strategi Pemasaran
    y += lineHeight / 2;
    y = writeText("Strategi Pemasaran:", margin, y);
    summary.marketing_summary.forEach((m) => {
      y = writeText(`Promosi: ${m.promotion_strategy}`, margin, y);
      y = writeText(`Media: ${m.media_used}`, margin, y);
      y = writeText(`Strategi Harga: ${m.pricing_strategy}`, margin, y);
      y += lineHeight / 2;
    });

    // Rencana Keuangan
    y += lineHeight / 2;
    y = writeText("Rencana Keuangan:", margin, y);
    summary.financial_summary.forEach((f) => {
      y = writeText(`Sumber Modal: ${f.capital_source}`, margin, y);
      y = writeText(`Modal Awal (CapEx): Rp${f.initial_capex}`, margin, y);
      y = writeText(`Biaya Operasional: Rp${f.operational_cost}`, margin, y);
      y = writeText(`Pendapatan: Rp${f.estimated_income}`, margin, y);
      y = writeText(`Laba/Rugi: Rp${f.profit_loss}`, margin, y);
      y += lineHeight / 2;
    });

    // Watermark untuk versi gratis
    if (!isPro) {
      doc.setGState(new doc.GState({ opacity: 0.08 }));
      doc.setTextColor(180, 180, 180);
      doc.setFontSize(50);
      const watermarkText = "WATERMARK - GRATIS";
      const angle = 45;
      const spacingX = 250;
      const spacingY = 200;

      for (let wy = 0; wy < pageHeight; wy += spacingY) {
        for (let wx = 0; wx < pageWidth; wx += spacingX) {
          doc.text(watermarkText, wx, wy, { angle });
        }
      }
      doc.setGState(new doc.GState({ opacity: 1 }));
    }

    doc.save(`Ringkasan-Eksekutif-${isPro ? "Pro" : "Gratis"}.pdf`);
  };

  if (!summary)
    return (
      <div className="text-center py-10 text-gray-500 font-medium">
        Memuat data ringkasan...
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto p-8 bg-gray-50 dark:bg-gray-900 rounded-xl shadow-lg mt-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
        Ringkasan Eksekutif
      </h1>

      <div className="space-y-8">
        {/* Latar Belakang Usaha */}
        <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-teal-600 dark:text-teal-400">
            Latar Belakang Usaha
          </h2>
          {summary.business_overview.map((b, i) => (
            <div key={i} className="mb-3 text-gray-700 dark:text-gray-300">
              <p className="font-semibold">
                {b.name} ({b.category})
              </p>
              <p className="text-sm">{b.description}</p>
            </div>
          ))}
        </section>

        {/* Strategi Pemasaran */}
        <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-teal-600 dark:text-teal-400">
            Strategi Pemasaran
          </h2>
          {summary.marketing_summary.map((m, i) => (
            <div key={i} className="mb-3 text-gray-700 dark:text-gray-300">
              <p className="text-sm">{m.promotion_strategy}</p>
              <p className="text-sm italic text-gray-500 dark:text-gray-400">
                Media: {m.media_used}
              </p>
            </div>
          ))}
        </section>

        {/* Rencana Keuangan */}
        <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-teal-600 dark:text-teal-400">
            Rencana Keuangan
          </h2>
          {summary.financial_summary.map((f, i) => (
            <div key={i} className="mb-3 text-gray-700 dark:text-gray-300">
              <p>Sumber Modal: {f.capital_source}</p>
              <p>Modal Awal (CapEx): Rp{f.initial_capex}</p>
              <p>Biaya Operasional: Rp{f.operational_cost}</p>
              <p>Pendapatan: Rp{f.estimated_income}</p>
              <p>Laba/Rugi: Rp{f.profit_loss}</p>
            </div>
          ))}
        </section>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row justify-end mt-6 gap-4">
        <button
          onClick={() => generatePDF(false)}
          className="px-5 py-2 rounded-lg bg-gray-600 text-white font-semibold hover:bg-gray-700 transition"
        >
          Download Gratis (Watermark)
        </button>
        <button
          onClick={() => generatePDF(true)}
          className="px-5 py-2 rounded-lg bg-teal-600 text-white font-semibold hover:bg-teal-700 transition"
        >
          Download Pro (Tanpa Watermark)
        </button>
      </div>
    </div>
  );
}
