import { useState, useEffect } from "react";
import api from "../api/generalService";

function Tools() {
  const [tools, setTools] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentTool, setCurrentTool] = useState({ id: null, name: "" });
  const [newToolName, setNewToolName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTools();
  }, []);

  const fetchTools = async () => {
    setIsLoading(true);
    try {
      const data = await api.tools.getAllTools();
      if (!data.error) {
        setTools(data);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Failed to fetch tools");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTool = async (e) => {
    e.preventDefault();
    if (!newToolName.trim()) return;

    try {
      const result = await api.tools.createTool(newToolName);
      if (!result.error) {
        await fetchTools();
        setNewToolName("");
        setShowAddModal(false);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError("Failed to add tool");
      console.error(err);
    }
  };

  const handleEditTool = async (e) => {
    e.preventDefault();
    if (!currentTool.name.trim()) return;

    try {
      const result = await api.tools.updateTool(
        currentTool.id,
        currentTool.name
      );
      if (!result.error) {
        await fetchTools();
        setShowEditModal(false);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError("Failed to update tool");
      console.error(err);
    }
  };

  const handleDeleteTool = async (id) => {
    if (window.confirm("Are you sure you want to delete this tool?")) {
      try {
        const result = await api.tools.deleteTool(id);
        if (!result.error) {
          await fetchTools();
        } else {
          setError(result.message);
        }
      } catch (err) {
        setError("Failed to delete tool");
        console.error(err);
      }
    }
  };

  const openEditModal = (tool) => {
    setCurrentTool({ ...tool });
    setShowEditModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-amber-800">Kitchen Tools</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-md flex items-center"
        >
          <span className="mr-2">Add Tool</span>
          <span>➕</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-700 mx-auto"></div>
          <p className="mt-3 text-amber-800">Loading tools...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.length > 0 ? (
            tools.map((tool) => (
              <div
                key={tool.id}
                className="bg-white rounded-lg shadow-md overflow-hidden border border-amber-200 hover:shadow-lg transition-shadow"
              >
                <div className="p-5">
                  <h3 className="text-xl font-semibold text-amber-800 mb-2">
                    {tool.name}
                  </h3>
                  <div className="flex justify-end space-x-2 mt-4">
                    <button
                      onClick={() => openEditModal(tool)}
                      className="text-amber-600 hover:text-amber-800"
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDeleteTool(tool.id)}
                      className="text-red-600 hover:text-red-800"
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-10 text-amber-700">
              No tools found. Add your first kitchen tool!
            </div>
          )}
        </div>
      )}

      {/* Add Tool Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold text-amber-800 mb-4">
              Add New Kitchen Tool
            </h3>
            <form onSubmit={handleAddTool}>
              <div className="mb-4">
                <label
                  className="block text-amber-700 mb-2"
                  htmlFor="tool-name"
                >
                  Tool Name
                </label>
                <input
                  id="tool-name"
                  type="text"
                  value={newToolName}
                  onChange={(e) => setNewToolName(e.target.value)}
                  className="w-full px-3 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="Enter tool name"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-amber-300 rounded-md text-amber-700 hover:bg-amber-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700"
                >
                  Add Tool
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Tool Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold text-amber-800 mb-4">
              Edit Kitchen Tool
            </h3>
            <form onSubmit={handleEditTool}>
              <div className="mb-4">
                <label
                  className="block text-amber-700 mb-2"
                  htmlFor="edit-tool-name"
                >
                  Tool Name
                </label>
                <input
                  id="edit-tool-name"
                  type="text"
                  value={currentTool.name}
                  onChange={(e) =>
                    setCurrentTool({ ...currentTool, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="Enter tool name"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 border border-amber-300 rounded-md text-amber-700 hover:bg-amber-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700"
                >
                  Update Tool
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Tools;
