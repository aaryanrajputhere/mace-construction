import "../styles/quote-table.css";

// Import all the components
import QuoteHeader from "../components/quote/QuoteHeader";
import QuoteItemsTable from "../components/quote/QuoteItemsTable";
import ProjectInfoForm from "../components/quote/ProjectInfoForm";
import FileUploadSection from "../components/quote/FileUploadSection";
import SubmitSection from "../components/quote/SubmitSection";
import SuccessMessage from "../components/quote/SuccessMessage";

// Import custom hook
import { useQuoteData } from "../hooks/useQuoteData";

const QuoteBuilder: React.FC = () => {
  const {
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
    updateItem,
    deleteItem,
    calculateItemTotal,
    calculateGrandTotal,
    handleFileUpload,
    removeFile,
    handleSubmit,
  } = useQuoteData();

  // Handle cancel
  const handleCancel = () => {
    window.history.back();
  };

  // Show success message if submitted
  if (submitSuccess) {
    return <SuccessMessage />;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 lg:space-y-10 pt-2">
      <QuoteHeader />

      {/* Content Container */}
      <div className="px-4 lg:px-6 space-y-8 lg:space-y-10">
        {/* Items Section */}
        <QuoteItemsTable
          items={items}
          onUpdateItem={updateItem}
          onDeleteItem={deleteItem}
          calculateItemTotal={calculateItemTotal}
          calculateGrandTotal={calculateGrandTotal}
        />

        {/* Project Information */}
        <ProjectInfoForm
          projectName={projectName}
          setProjectName={setProjectName}
          siteAddress={siteAddress}
          setSiteAddress={setSiteAddress}
          neededBy={neededBy}
          setNeededBy={setNeededBy}
          requesterName={requesterName}
          setRequesterName={setRequesterName}
          requesterEmail={requesterEmail}
          setRequesterEmail={setRequesterEmail}
          requesterPhone={requesterPhone}
          setRequesterPhone={setRequesterPhone}
          notes={notes}
          setNotes={setNotes}
        />

        {/* File Upload */}
        <FileUploadSection
          files={files}
          onFileUpload={handleFileUpload}
          onRemoveFile={removeFile}
        />

        {/* Submit Section */}
        <SubmitSection
          isFormValid={!!isFormValid}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
};

export default QuoteBuilder;
