import { useState, useEffect } from "react";
import { X, Plus, Trash2, RotateCcw, Check, Car, Bike, Palette, Loader2, AlertCircle } from "lucide-react";
import {
  getAdminVehicleOptions,
  updateAdminVehicleOptions,
  resetAdminVehicleOptions,
  type VehicleOptions,
  type BrandModelOption,
} from "@/api/vehicleApi";

interface ManageVehicleOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ManageVehicleOptionsModal({ isOpen, onClose }: ManageVehicleOptionsModalProps) {
  const [activeTab, setActiveTab] = useState<"cars" | "motorcycles" | "colors">("cars");
  const [options, setOptions] = useState<VehicleOptions | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Form states for adding items
  const [newBrand, setNewBrand] = useState("");
  const [selectedBrandForModel, setSelectedBrandForModel] = useState<string>("");
  const [newModel, setNewModel] = useState("");
  const [newColor, setNewColor] = useState("");

  const fetchOptions = async () => {
    try {
      setIsLoading(true);
      setStatusMessage(null);
      const res = await getAdminVehicleOptions();
      if (res.success && res.options) {
        setOptions(res.options);
        if (res.options.cars.length > 0) {
          setSelectedBrandForModel(res.options.cars[0].brand);
        }
      }
    } catch (err: any) {
      setStatusMessage({ type: "error", text: "Failed to load vehicle options from database." });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchOptions();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!options) return;
    const list = activeTab === "cars" ? options.cars : options.motorcycles;
    if (list.length > 0 && (!selectedBrandForModel || !list.some((b) => b.brand === selectedBrandForModel))) {
      setSelectedBrandForModel(list[0].brand);
    }
  }, [activeTab, options]);

  if (!isOpen) return null;

  // Add Brand
  const handleAddBrand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBrand.trim() || !options) return;
    const trimmed = newBrand.trim();
    const targetKey = activeTab === "cars" ? "cars" : "motorcycles";

    const exists = options[targetKey].some((b) => b.brand.toLowerCase() === trimmed.toLowerCase());
    if (exists) {
      alert(`Brand "${trimmed}" already exists.`);
      return;
    }

    const updatedList: BrandModelOption[] = [...options[targetKey], { brand: trimmed, models: [] }];
    setOptions({ ...options, [targetKey]: updatedList });
    setSelectedBrandForModel(trimmed);
    setNewBrand("");
  };

  // Remove Brand
  const handleRemoveBrand = (brandToRemove: string) => {
    if (!options) return;
    if (!confirm(`Are you sure you want to remove ${brandToRemove} and all its models?`)) return;
    const targetKey = activeTab === "cars" ? "cars" : "motorcycles";
    const updatedList = options[targetKey].filter((b) => b.brand !== brandToRemove);
    setOptions({ ...options, [targetKey]: updatedList });
    if (selectedBrandForModel === brandToRemove) {
      setSelectedBrandForModel(updatedList[0]?.brand || "");
    }
  };

  // Add Model to Selected Brand
  const handleAddModel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newModel.trim() || !selectedBrandForModel || !options) return;
    const trimmed = newModel.trim();
    const targetKey = activeTab === "cars" ? "cars" : "motorcycles";

    const updatedList = options[targetKey].map((b) => {
      if (b.brand === selectedBrandForModel) {
        if (b.models.some((m) => m.toLowerCase() === trimmed.toLowerCase())) {
          alert(`Model "${trimmed}" already exists for ${b.brand}.`);
          return b;
        }
        return { ...b, models: [...b.models, trimmed] };
      }
      return b;
    });

    setOptions({ ...options, [targetKey]: updatedList });
    setNewModel("");
  };

  // Remove Model from Brand
  const handleRemoveModel = (brand: string, modelToRemove: string) => {
    if (!options) return;
    const targetKey = activeTab === "cars" ? "cars" : "motorcycles";
    const updatedList = options[targetKey].map((b) => {
      if (b.brand === brand) {
        return { ...b, models: b.models.filter((m) => m !== modelToRemove) };
      }
      return b;
    });
    setOptions({ ...options, [targetKey]: updatedList });
  };

  // Add Color
  const handleAddColor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newColor.trim() || !options) return;
    const trimmed = newColor.trim();
    if (options.colors.some((c) => c.toLowerCase() === trimmed.toLowerCase())) {
      alert(`Color "${trimmed}" already exists.`);
      return;
    }
    setOptions({ ...options, colors: [...options.colors, trimmed] });
    setNewColor("");
  };

  // Remove Color
  const handleRemoveColor = (colorToRemove: string) => {
    if (!options) return;
    setOptions({ ...options, colors: options.colors.filter((c) => c !== colorToRemove) });
  };

  // Save changes to database
  const handleSave = async () => {
    if (!options) return;
    try {
      setIsSaving(true);
      setStatusMessage(null);
      const res = await updateAdminVehicleOptions(options);
      if (res.success) {
        setStatusMessage({ type: "success", text: "Vehicle options saved successfully to database!" });
        setTimeout(() => {
          onClose();
        }, 1200);
      }
    } catch (err: any) {
      setStatusMessage({ type: "error", text: err.response?.data?.message || "Failed to save options." });
    } finally {
      setIsSaving(false);
    }
  };

  // Reset to default PH vehicle list
  const handleResetToDefault = async () => {
    if (!confirm("Are you sure you want to reset all vehicle options to the standard Philippine vehicle catalogue?")) return;
    try {
      setIsSaving(true);
      const res = await resetAdminVehicleOptions();
      if (res.success && res.options) {
        setOptions(res.options);
        setStatusMessage({ type: "success", text: "Reset to standard Philippine vehicle list successfully!" });
      }
    } catch (err: any) {
      setStatusMessage({ type: "error", text: "Failed to reset options." });
    } finally {
      setIsSaving(false);
    }
  };

  const currentBrandsList = options ? (activeTab === "cars" ? options.cars : options.motorcycles) : [];
  const activeBrandObj = currentBrandsList.find((b) => b.brand === selectedBrandForModel);

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in overflow-y-auto">
      <div className="w-full max-w-4xl rounded-[32px] bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-2xl border border-slate-100 dark:border-slate-800 space-y-6 relative transition-colors my-auto max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 shrink-0">
          <div>
            <h2 className="font-poppins text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>⚙️ Manage Vehicle Dropdown Options</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Configure standardized brands, models, and colors for student registration and gate forms.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Status Message */}
        {statusMessage && (
          <div
            className={`p-3 rounded-2xl text-xs font-semibold flex items-center gap-2 shrink-0 ${
              statusMessage.type === "success"
                ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
                : "bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800"
            }`}
          >
            {statusMessage.type === "success" ? <Check className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-2 shrink-0">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("cars")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "cars"
                  ? "bg-[#0053CC] text-white shadow-xs"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
              }`}
            >
              <Car className="h-4 w-4" /> Cars & SUVs ({options?.cars.length || 0})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("motorcycles")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "motorcycles"
                  ? "bg-[#0053CC] text-white shadow-xs"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
              }`}
            >
              <Bike className="h-4 w-4" /> Motorcycles ({options?.motorcycles.length || 0})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("colors")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "colors"
                  ? "bg-[#0053CC] text-white shadow-xs"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
              }`}
            >
              <Palette className="h-4 w-4" /> Colors ({options?.colors.length || 0})
            </button>
          </div>

          <button
            type="button"
            onClick={handleResetToDefault}
            disabled={isSaving || isLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer disabled:opacity-50"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Load Standard PH Vehicles</span>
          </button>
        </div>

        {/* Content Body */}
        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-[#0053CC]" />
            <p className="text-xs text-slate-400 mt-2">Loading vehicle catalogue...</p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto pr-1 space-y-6">
            {activeTab !== "colors" ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Column 1: Brands List */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Brands
                    </span>
                    <span className="text-[11px] text-slate-400">{currentBrandsList.length} items</span>
                  </div>

                  <form onSubmit={handleAddBrand} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add Brand (e.g. BYD)..."
                      value={newBrand}
                      onChange={(e) => setNewBrand(e.target.value)}
                      className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3 py-2 text-xs focus:outline-none focus:border-[#0053CC]"
                    />
                    <button
                      type="submit"
                      disabled={!newBrand.trim()}
                      className="p-2 rounded-xl bg-[#0053CC] text-white hover:bg-[#0042A5] transition-colors disabled:opacity-50 cursor-pointer"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </form>

                  <div className="max-h-72 overflow-y-auto space-y-1.5 pr-1">
                    {currentBrandsList.map((b) => (
                      <div
                        key={b.brand}
                        onClick={() => setSelectedBrandForModel(b.brand)}
                        className={`flex items-center justify-between p-2.5 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                          selectedBrandForModel === b.brand
                            ? "bg-blue-50 dark:bg-blue-950/50 border-[#0053CC] text-[#0053CC] dark:text-blue-400 font-bold"
                            : "bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50"
                        }`}
                      >
                        <span>{b.brand}</span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-full text-slate-500">
                            {b.models.length}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveBrand(b.brand);
                            }}
                            className="p-1 hover:text-red-500 rounded text-slate-400 transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Column 2 & 3: Models for Selected Brand */}
                <div className="md:col-span-2 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Models for {selectedBrandForModel || "Brand"}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {activeBrandObj?.models.length || 0} models registered
                    </span>
                  </div>

                  {selectedBrandForModel ? (
                    <>
                      <form onSubmit={handleAddModel} className="flex gap-2">
                        <input
                          type="text"
                          placeholder={`Add model under ${selectedBrandForModel} (e.g. Yaris Cross)...`}
                          value={newModel}
                          onChange={(e) => setNewModel(e.target.value)}
                          className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3 py-2 text-xs focus:outline-none focus:border-[#0053CC]"
                        />
                        <button
                          type="submit"
                          disabled={!newModel.trim()}
                          className="px-4 py-2 rounded-xl bg-[#0053CC] text-white hover:bg-[#0042A5] font-semibold text-xs transition-colors disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
                        >
                          <Plus className="h-4 w-4" /> Add Model
                        </button>
                      </form>

                      <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 min-h-60 max-h-72 overflow-y-auto">
                        {activeBrandObj?.models && activeBrandObj.models.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {activeBrandObj.models.map((model) => (
                              <div
                                key={model}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-xs"
                              >
                                <span>{model}</span>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveModel(selectedBrandForModel, model)}
                                  className="text-slate-400 hover:text-red-500 rounded p-0.5 transition-colors cursor-pointer"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="h-40 flex flex-col items-center justify-center text-center text-slate-400">
                            <p className="text-xs">No models registered yet for {selectedBrandForModel}.</p>
                            <p className="text-[11px] mt-1">Use the field above to add models.</p>
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="p-8 text-center text-slate-400 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                      Select or add a brand to manage its models.
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Colors Tab */
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Available Vehicle Colors
                  </span>
                  <span className="text-[11px] text-slate-400">{options?.colors.length || 0} colors</span>
                </div>

                <form onSubmit={handleAddColor} className="flex gap-2 max-w-md">
                  <input
                    type="text"
                    placeholder="Add color (e.g. Matte Gray, Pearl Red)..."
                    value={newColor}
                    onChange={(e) => setNewColor(e.target.value)}
                    className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3 py-2 text-xs focus:outline-none focus:border-[#0053CC]"
                  />
                  <button
                    type="submit"
                    disabled={!newColor.trim()}
                    className="px-4 py-2 rounded-xl bg-[#0053CC] text-white hover:bg-[#0042A5] font-semibold text-xs transition-colors disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="h-4 w-4" /> Add Color
                  </button>
                </form>

                <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 min-h-60 max-h-72 overflow-y-auto">
                  <div className="flex flex-wrap gap-2.5">
                    {options?.colors.map((color) => (
                      <div
                        key={color}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-xs"
                      >
                        <span className="h-3 w-3 rounded-full border border-slate-300 dark:border-slate-600 bg-slate-300"></span>
                        <span>{color}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveColor(color)}
                          className="text-slate-400 hover:text-red-500 rounded p-0.5 transition-colors cursor-pointer"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer Actions */}
        <div className="border-t border-slate-100 dark:border-slate-800 pt-4 flex items-center justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving || isLoading}
            className="px-6 py-2.5 rounded-xl bg-[#0053CC] hover:bg-[#0042A5] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
            <span>Save Options to Database</span>
          </button>
        </div>
      </div>
    </div>
  );
}
