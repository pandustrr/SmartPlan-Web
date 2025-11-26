import { useState, useEffect } from "react";
import SummaryList from "./Summary-List";
import SummaryView from "./Summary-View";
import YearManager from "./Year-Manager";
import { managementFinancialApi } from "../../../services/managementFinancial";
import { toast } from "react-toastify";

const FinancialSummaries = ({ onBack, selectedBusiness }) => {
  const [summaries, setSummaries] = useState([]);
  const [currentSummary, setCurrentSummary] = useState(null);
  const [view, setView] = useState("list"); // Default langsung ke list
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [availableYears, setAvailableYears] = useState([currentYear]);

  // Load available years dari summaries yang ada
  useEffect(() => {
    if (summaries.length > 0) {
      const yearsFromSummaries = [...new Set(summaries.map((s) => s.year))];
      const allYears = [...new Set([...availableYears, ...yearsFromSummaries, currentYear])];
      setAvailableYears(allYears.sort((a, b) => b - a));
    }
  }, [summaries]);

  // Fetch semua summaries
  const fetchSummaries = async (year = selectedYear) => {
    try {
      setIsLoading(true);
      setError(null);

      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || !user.id) {
        throw new Error("User data not found. Please login again.");
      }

      if (!selectedBusiness) {
        setSummaries([]);
        setIsLoading(false);
        return;
      }

      const params = {
        user_id: user.id,
        business_background_id: selectedBusiness.id,
        year: year,
      };

      console.log("Fetching financial summaries with params:", params);
      const response = await managementFinancialApi.summaries.getAll(params);

      if (response.data && response.data.status === "success") {
        setSummaries(response.data.data || []);
      } else {
        throw new Error(response.data?.message || "Failed to fetch summaries");
      }
    } catch (error) {
      console.error("Error fetching summaries:", error);

      let errorMessage = "Gagal memuat data ringkasan keuangan";
      if (error.response?.status === 500) {
        errorMessage = "Server error: Silakan coba lagi nanti.";
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSummaries(selectedYear);
  }, [selectedYear, selectedBusiness]);

  // Handler untuk year management
  const handleAddYear = async (newYear) => {
    if (!availableYears.includes(newYear)) {
      setAvailableYears((prev) => [...prev, newYear].sort((a, b) => b - a));
      setSelectedYear(newYear);

      // Simpan ke localStorage untuk persistensi
      const userYears = JSON.parse(localStorage.getItem("user_years") || "[]");
      localStorage.setItem("user_years", JSON.stringify([...userYears, newYear]));
    }
  };

  const handleDeleteYear = async (yearToDelete) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      // Delete semua summary di tahun tersebut dari database
      const summariesInYear = summaries.filter((s) => s.year === yearToDelete);
      for (const summary of summariesInYear) {
        await managementFinancialApi.summaries.delete(summary.id, user.id);
      }

      // Update available years
      const newAvailableYears = availableYears.filter((year) => year !== yearToDelete);
      setAvailableYears(newAvailableYears);

      // Update selected year
      const newSelectedYear = newAvailableYears.includes(currentYear) ? currentYear : newAvailableYears[0];
      setSelectedYear(newSelectedYear);

      // Update localStorage
      localStorage.setItem("user_years", JSON.stringify(newAvailableYears));

      // Refresh data
      await fetchSummaries(newSelectedYear);
    } catch (error) {
      console.error("Error deleting year:", error);
      throw error;
    }
  };

  const handleYearChange = (year) => {
    setSelectedYear(year);
    setError(null);
  };

  // Load available years dari localStorage saat initial load
  useEffect(() => {
    const loadAvailableYears = () => {
      try {
        const savedYears = JSON.parse(localStorage.getItem("user_years"));
        if (savedYears && savedYears.length > 0) {
          setAvailableYears(savedYears.sort((a, b) => b - a));
        } else {
          // Default years
          const defaultYears = [currentYear, currentYear - 1, currentYear + 1];
          setAvailableYears(defaultYears);
          localStorage.setItem("user_years", JSON.stringify(defaultYears));
        }
      } catch (error) {
        console.error("Error loading years from localStorage:", error);
        const defaultYears = [currentYear, currentYear - 1, currentYear + 1];
        setAvailableYears(defaultYears);
      }
    };

    loadAvailableYears();
  }, []);

  // Handler functions
  const handleView = (summary) => {
    setCurrentSummary(summary);
    setView("view");
  };

  const handleGenerateSummary = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || !user.id) {
        throw new Error("User data not found. Please login again.");
      }

      if (!selectedBusiness || !selectedBusiness.id) {
        throw new Error("Business not selected. Please select a business first.");
      }

      const data = {
        user_id: user.id,
        business_background_id: selectedBusiness.id,
        year: selectedYear,
      };

      console.log("Generating summary from simulations:", data);
      const response = await managementFinancialApi.summaries.generateFromSimulations(data);

      if (response.data.status === "success") {
        toast.success(`Berhasil generate ${response.data.data.generated_count} ringkasan keuangan!`, {
          position: "top-right",
          autoClose: 3000,
        });
        await fetchSummaries();
      } else {
        throw new Error(response.data.message || "Failed to generate summaries");
      }
    } catch (error) {
      console.error("Error generating summaries:", error);

      let errorMessage = "Gagal generate ringkasan keuangan";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
      });
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (summaryId) => {
    try {
      setError(null);
      const user = JSON.parse(localStorage.getItem("user"));
      const response = await managementFinancialApi.summaries.delete(summaryId, user.id);

      if (response.data.status === "success") {
        await fetchSummaries();
      } else {
        throw new Error(response.data.message || "Failed to delete summary");
      }
    } catch (error) {
      console.error("Error deleting summary:", error);
      let errorMessage = "Terjadi kesalahan saat menghapus data ringkasan";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      setError(errorMessage);
    }
  };

  const handleBackToList = () => {
    setView("list");
    setCurrentSummary(null);
    setError(null);
  };

  const handleEdit = (summary) => {
    // Untuk saat ini, edit summary belum diimplementasikan
    // Bisa redirect ke form edit atau show toast
    toast.info("Fitur edit ringkasan akan segera tersedia", {
      position: "top-right",
      autoClose: 3000,
    });
  };

  const handleRetry = () => {
    setError(null);
    fetchSummaries();
  };

  // Render loading state
  if (isLoading && view === "list") {
    return (
      <div className="min-h-screen py-6 bg-gray-50 dark:bg-gray-900">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 border-b-2 border-green-600 rounded-full animate-spin"></div>
              <p className="text-gray-600 dark:text-gray-400">Memuat data ringkasan keuangan...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render different views
  const renderView = () => {
    switch (view) {
      case "list":
        return (
          <SummaryList
            summaries={summaries}
            onView={handleView}
            onDelete={handleDelete}
            onGenerateSummary={handleGenerateSummary}
            selectedYear={selectedYear}
            onYearChange={handleYearChange}
            onBack={onBack}
            isLoading={isLoading}
            error={error}
            onRetry={handleRetry}
          />
        );
      case "view":
        return <SummaryView summary={currentSummary} onBack={handleBackToList} onEdit={handleEdit} />;
      default:
        return (
          <SummaryList
            summaries={summaries}
            onView={handleView}
            onDelete={handleDelete}
            onGenerateSummary={handleGenerateSummary}
            selectedYear={selectedYear}
            onYearChange={handleYearChange}
            onBack={onBack}
            isLoading={isLoading}
            error={error}
            onRetry={handleRetry}
          />
        );
    }
  };

  return (
    <div className="min-h-screen py-6 bg-gray-50 dark:bg-gray-900">
      <div className="px-4 mx-auto space-y-6 max-w-7xl sm:px-6 lg:px-8">
        {/* YearManager hanya untuk list view */}
        {view === "list" && <YearManager availableYears={availableYears} selectedYear={selectedYear} onYearChange={handleYearChange} onAddYear={handleAddYear} onDeleteYear={handleDeleteYear} summaries={summaries} />}

        {renderView()}
      </div>
    </div>
  );
};

export default FinancialSummaries;
