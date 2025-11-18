import { useMaterials } from "../../hooks/materials/useMaterials";
import { useDeleteMaterial } from "../../hooks/materials/useDeleteMaterial";
import { useState } from "react";
import AddMaterialModal from "./AddMaterialModal";

const MaterialsTable = () => {
  const { materials, loading } = useMaterials();
  const { deleteMaterial } = useDeleteMaterial();
  const [showModal, setShowModal] = useState(false);

  console.log("Materials data:", materials);
  console.log("Loading state:", loading);
  console.log("Materials length:", materials?.length);

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <p className="text-xl text-gray-600">Loading materials...</p>
        </div>
      </div>
    );
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this material?")) return;

    try {
      await deleteMaterial(String(id));
      alert("Material deleted successfully");
      window.location.reload();
    } catch (err) {
      console.error("Error deleting material:", err);
      alert("Failed to delete material");
    }
  };

  const handleAddMaterial = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSuccess = () => {
    window.location.reload();
  };

  if (!materials || materials.length === 0) {
    return (
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Materials</h1>
          <button
            onClick={handleAddMaterial}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition"
          >
            + Add Material
          </button>
        </div>
        <div className="flex items-center justify-center h-64 bg-white rounded-lg border">
          <p className="text-xl text-gray-600">No materials found</p>
        </div>

        <AddMaterialModal
          isOpen={showModal}
          onClose={handleCloseModal}
          onSuccess={handleSuccess}
        />
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Materials</h1>
          <p className="text-gray-600 mt-1">
            Total: {materials.length} materials
          </p>
        </div>
        <button
          onClick={handleAddMaterial}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition"
        >
          + Add Material
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Item Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Size
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Unit
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vendors
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Image
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {materials.map((material) => (
                <tr key={material.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">
                      {material.itemName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {material.category}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{material.size}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{material.unit}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">
                      ${material.price}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {material.vendors || "-"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {material.image ? (
                      <img
                        src={material.image}
                        alt={material.itemName}
                        className="h-10 w-10 rounded object-cover"
                      />
                    ) : (
                      <span className="text-sm text-gray-400">No image</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleDelete(material.id)}
                      className="text-red-600 hover:text-red-900 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AddMaterialModal
        isOpen={showModal}
        onClose={handleCloseModal}
        onSuccess={handleSuccess}
      />
    </div>
  );
};

export default MaterialsTable;
