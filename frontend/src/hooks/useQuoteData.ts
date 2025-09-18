import { useState, useEffect } from "react";
import type { Material } from "../types/materials";

interface ProjectInfo {
  projectName: string;
  siteAddress: string;
  neededBy: string;
  notes: string;
  requesterName: string;
  requesterEmail: string;
  requesterPhone: string;
}

export const useQuoteData = () => {
  // Contact information state
  const [requesterName, setRequesterName] = useState("");
  const [requesterEmail, setRequesterEmail] = useState("");
  const [requesterPhone, setRequesterPhone] = useState("");

  // Project information state
  const [items, setItems] = useState<Material[]>([]);
  const [projectName, setProjectName] = useState("");
  const [siteAddress, setSiteAddress] = useState("");
  const [neededBy, setNeededBy] = useState("");
  const [notes, setNotes] = useState("");
  const [files, setFiles] = useState<File[]>([]);

  // Form state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Load items from localStorage (from calculators/catalog)
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("quote") || "[]");
    console.log(stored);
    // Transform localStorage objects to match table fields and assign sequential IDs
    const mapped = stored.map((item: any, index: number) => ({
      id: index + 1,
      Category: item.category || "",
      "Item Name": item.name || "",
      "Size/Option": item.size || item.option || "",
      Unit: item.unit || "",
      Price: item.price !== undefined ? String(item.price) : "",
      Vendors: item["vendors"] || item["Vendors"] || "",
      image: item.image || "",
      Quantity: item.quantity !== undefined ? String(item.quantity) : "1",
    }));
    setItems(mapped);
    console.log(mapped);
  }, []);

  // Add new item
  const addNewItem = () => {
    const newId =
      items.length > 0 ? Math.max(...items.map((item) => item.id)) + 1 : 1;

    setItems([
      ...items,
      {
        id: newId,
        Category: "",
        "Item Name": "",
        "Size/Option": "",
        Unit: "",
        Price: "",
        Vendors: "",
        image: "",
        Quantity: "1",
      },
    ]);
  };

  // Handle editing table
  const updateItem = (index: number, field: keyof Material, value: any) => {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  // Delete row
  const deleteItem = (index: number) => {
    setItems((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      // Find the id of the deleted item
      const deletedItem = prev[index];
      // Re-assign sequential IDs after deletion
      const reIndexed = updated.map((item, i) => ({
        ...item,
        id: i + 1,
      }));
      localStorage.setItem("quote", JSON.stringify(reIndexed));
      // Remove from selectedVendors in localStorage
      if (deletedItem && deletedItem.id !== undefined) {
        try {
          const svObj =
            JSON.parse(localStorage.getItem("selectedVendors") || "{}") || {};
          delete svObj[deletedItem.id];
          localStorage.setItem("selectedVendors", JSON.stringify(svObj));
        } catch {}
      }
      return reIndexed;
    });
  };

  // Calculate total price for an item
  const calculateItemTotal = (price: string, quantity: string): number => {
    const priceNum = parseFloat(price.replace(/[^0-9.-]/g, "")) || 0;
    const quantityNum = parseInt(quantity) || 0;
    return priceNum * quantityNum;
  };

  // Calculate grand total
  const calculateGrandTotal = (): number => {
    return items.reduce((total, item) => {
      return total + calculateItemTotal(item.Price, item.Quantity || "1");
    }, 0);
  };

  // Handle file uploads
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setFiles(Array.from(e.target.files));
  };

  // Remove file
  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Submit RFQ
  const handleSubmit = async () => {
    if (!projectName.trim() || items.length === 0) {
      alert("Please fill in project name and add items.");
      return;
    }

    if (
      !requesterName.trim() ||
      !requesterEmail.trim() ||
      !requesterPhone.trim()
    ) {
      alert(
        "Please fill in your contact information (name, email, and phone number)."
      );
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(requesterEmail)) {
      alert("Please enter a valid email address.");
      return;
    }

    setIsSubmitting(true);
    const projectInfo: ProjectInfo = {
      projectName,
      siteAddress,
      neededBy,
      notes,
      requesterName,
      requesterEmail,
      requesterPhone,
    };

    const formData = new FormData();
    formData.append(
      "projectInfo",
      JSON.stringify({
        ...projectInfo,
        createdAt: new Date().toISOString(),
      })
    );
    formData.append("items", JSON.stringify(items));
    files.forEach((file) => formData.append("files", file));
    console.log(items);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/quotes/apply`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!res.ok) throw new Error("Failed to submit RFQ");

      const result = await res.json();
      console.log("✅ RFQ submitted:", result);
      setSubmitSuccess(true);
    } catch (err) {
      console.error("❌ RFQ submission error:", err);
      alert("Error submitting RFQ. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check form validity
  const isFormValid =
    projectName.trim() &&
    items.length > 0 &&
    requesterName.trim() &&
    requesterEmail.trim() &&
    requesterPhone.trim();

  return {
    // State
    requesterName,
    setRequesterName,
    requesterEmail,
    setRequesterEmail,
    requesterPhone,
    setRequesterPhone,
    items,
    projectName,
    setProjectName,
    siteAddress,
    setSiteAddress,
    neededBy,
    setNeededBy,
    notes,
    setNotes,
    files,
    isSubmitting,
    submitSuccess,
    isFormValid,

    // Functions
    addNewItem,
    updateItem,
    deleteItem,
    calculateItemTotal,
    calculateGrandTotal,
    handleFileUpload,
    removeFile,
    handleSubmit,
  };
};
