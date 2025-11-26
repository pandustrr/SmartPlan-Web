// frontend/src/components/ManagementFinancial/FinancialSimulation/Simulation-Create.jsx

import { useState } from "react";
import { Save } from "lucide-react";
import SimulationForm from "./Simulation-Form";
import { managementFinancialApi } from "../../../services/managementFinancial";
import { toast } from "react-toastify";

const SimulationCreate = ({ categories, onBack, onSuccess, selectedBusiness }) => {
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    type: "",
    financial_category_id: "",
    amount: "",
    simulation_date: new Date().toISOString().split("T")[0],
    description: "",
    payment_method: "cash",
    status: "planned",
    is_recurring: false,
    recurring_frequency: "",
    recurring_end_date: "",
    notes: "",
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Reset category when type changes
    if (name === "type") {
      setFormData((prev) => ({ ...prev, financial_category_id: "" }));
    }
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const user = JSON.parse(localStorage.getItem("user"));

      if (!user || !user.id) {
        throw new Error("User data not found");
      }

      if (!selectedBusiness || !selectedBusiness.id) {
        throw new Error("Business not selected");
      }

      const submitData = {
        ...formData,
        user_id: user.id,
        business_background_id: selectedBusiness.id,
        amount: parseFloat(formData.amount) || 0,
      };

      // Clean up recurring data if not recurring
      if (!submitData.is_recurring) {
        submitData.recurring_frequency = null;
        submitData.recurring_end_date = null;
      }

      console.log("Creating financial simulation:", submitData);
      const response = await managementFinancialApi.simulations.create(submitData);

      if (response.data.status === "success") {
        toast.success("Simulasi keuangan berhasil dibuat!");
        onSuccess();
      } else {
        throw new Error(response.data.message || "Terjadi kesalahan");
      }
    } catch (error) {
      console.error("Error creating financial simulation:", error);

      let errorMessage = "Terjadi kesalahan saat membuat simulasi keuangan";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.errors) {
        const errors = Object.values(error.response.data.errors).flat();
        errorMessage = errors.join(", ");
      }

      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SimulationForm
      title="Tambah Simulasi Keuangan"
      subtitle="Buat simulasi baru untuk mengelola arus kas"
      formData={formData}
      isLoading={isLoading}
      categories={categories}
      onInputChange={handleInputChange}
      onSelectChange={handleSelectChange}
      onCheckboxChange={handleCheckboxChange}
      onSubmit={handleSubmit}
      onBack={onBack}
      submitButtonText="Simpan Simulasi"
      submitButtonIcon={<Save size={16} />}
      mode="create"
    />
  );
};

export default SimulationCreate;
