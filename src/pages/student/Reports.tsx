import { useState, useRef, useEffect } from "react";
import { 
  FileText, 
  History, 
  UploadCloud, 
  CheckCircle2, 
  X, 
  ChevronRight, 
  ArrowLeft,
  Info,
  Loader2
} from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { submitIncidentReport, getMyIncidentReports } from "@/api/incidentApi";

interface Incident {
  id: string;
  reportId: string;
  title: string;
  type: string;
  vehicleType: string;
  color: string;
  model: string;
  plateNumber: string;
  dateTime: string;
  status: "In Progress" | "Resolved" | "Closed";
  image: string;
  description: string;
}

export default function Reports() {
  const currentUser = JSON.parse(localStorage.getItem("user") || "null");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Active View Tab: 'main' (Home/Recent) o 'history' (Full History View)
  const [activeTab, setActiveTab] = useState<"main" | "history">("main");
  
  // History Filter State: 'All' | 'In Progress' | 'Resolved' | 'Closed'
  const [historyFilter, setHistoryFilter] = useState<string>("All");

  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Fetch student's real reports from backend
  const fetchMyReports = async () => {
    try {
      setIsLoading(true);
      const res = await getMyIncidentReports();
      if (res.success && Array.isArray(res.reports)) {
        const mapped: Incident[] = res.reports.map((r) => ({
          id: r.id.toString(),
          reportId: r.referenceId,
          title: `${r.reportType} - ${r.vehicleType}`,
          type: r.reportType,
          vehicleType: r.vehicleType,
          color: r.color || "--",
          model: r.model || "--",
          plateNumber: r.plateNumber,
          dateTime: new Date(r.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
          status: r.status === "Reviewed" ? "Resolved" : r.status === "Rejected" ? "Closed" : "In Progress",
          image: r.evidenceImage || "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=500",
          description: r.description,
        }));
        setIncidents(mapped);
      }
    } catch (err) {
      console.error("Failed to load user incident reports:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMyReports();
  }, []);

  // Modal States
  const [isNewReportOpen, setIsNewReportOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  
  // Selected Item for Details or Success Receipt
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);

  // Form Fields & Errors
  const [formData, setFormData] = useState({
    vehicleType: "",
    color: "",
    model: "",
    plateNumber: "",
    reportType: "Blocking Parking Space",
    description: "",
    photo: null as File | null,
    photoPreview: "",
  });

  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  // Handle File Upload Change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert("File size exceeds 10MB limit.");
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setFormData((prev) => ({
      ...prev,
      photo: file,
      photoPreview: previewUrl,
    }));
    if (formErrors.photo) {
      const updatedErrors = { ...formErrors };
      delete updatedErrors.photo;
      setFormErrors(updatedErrors);
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: { [key: string]: string } = {};

    if (!formData.vehicleType) errors.vehicleType = "Vehicle type is required.";
    if (!formData.color) errors.color = "Color is required.";
    if (!formData.model) errors.model = "Model is required.";
    if (!formData.plateNumber) errors.plateNumber = "Plate number is required.";
    if (!formData.reportType) errors.reportType = "Report type is required.";
    if (!formData.photo && !formData.photoPreview) errors.photo = "Photo evidence is required.";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await submitIncidentReport({
        vehicleType: formData.vehicleType,
        color: formData.color,
        model: formData.model,
        plateNumber: formData.plateNumber,
        reportType: formData.reportType,
        description: formData.description || "Reported incident directly by user.",
        evidenceImage: formData.photoPreview || null,
      });

      if (res.success && res.incident) {
        const created = res.incident;
        const newInc: Incident = {
          id: created.id.toString(),
          reportId: created.referenceId,
          title: `${created.reportType} - ${created.vehicleType}`,
          type: created.reportType,
          vehicleType: created.vehicleType,
          color: created.color || "--",
          model: created.model || "--",
          plateNumber: created.plateNumber,
          dateTime: new Date(created.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
          status: "In Progress",
          image: created.evidenceImage || formData.photoPreview,
          description: created.description,
        };

        setIncidents((prev) => [newInc, ...prev]);
        setSelectedIncident(newInc);
        setIsNewReportOpen(false);
        setFormData({
          vehicleType: "",
          color: "",
          model: "",
          plateNumber: "",
          reportType: "Blocking Parking Space",
          description: "",
          photo: null,
          photoPreview: "",
        });
        setIsSuccessOpen(true);
        setFormErrors({});
      }
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to submit incident report.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filtered list for History View
  const filteredIncidents = incidents.filter((item) => {
    if (historyFilter === "All") return true;
    return item.status === historyFilter;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans pb-32 transition-colors duration-300">
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/png, image/jpeg, application/pdf"
        className="hidden"
      />

      {/* Top Header */}
      <Header currentUser={currentUser} />

      {/* Main Content Area */}
      <main className="mx-auto max-w-5xl p-4 sm:p-8 space-y-6">
        
        {/* BANNER HEADER */}
        {activeTab === "main" ? (
          <div className="rounded-2xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-xs transition-colors duration-300">
            <h1 className="font-poppins text-xl sm:text-2xl font-extrabold text-[#0053CC] dark:text-blue-400">  
              Incident Report
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Report accidents, damages, or safety concerns directly to fleet supervisors and receive official digital receipts.
            </p>
          </div>
        ) : (
          <div className="rounded-2xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-xs space-y-4 transition-colors duration-300">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setActiveTab("main")}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer shrink-0"
                title="Back to Summary"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <div>
                <h1 className="font-poppins text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                  Incident History
                </h1>
                <p className="text-[11px] text-slate-400">
                  Report accidents, damages, or safety concerns directly to fleet supervisors and receive official digital receipts.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TOP ACTION CARDS (Report New Incident / View History) */}
        {activeTab === "main" && (
          <div className="rounded-2xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 sm:p-6 shadow-xs transition-colors duration-300">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Card 1: Report New Incident */}
              <button
                type="button"
                onClick={() => setIsNewReportOpen(true)}
                className="flex items-center gap-4 p-5 rounded-2xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/40 hover:bg-blue-100/80 dark:hover:bg-blue-900/60 transition-all text-left cursor-pointer group"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shrink-0">
                  <FileText className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm group-hover:text-[#0053CC] dark:group-hover:text-blue-400 transition-colors">
                    Report New Incident
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Provide the exact time and place.
                  </p>
                </div>
              </button>

              {/* Card 2: View History */}
              <button
                type="button"
                onClick={() => setActiveTab("history")}
                className="flex items-center gap-4 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-left cursor-pointer group"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 shrink-0">
                  <History className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm group-hover:text-[#0053CC] dark:group-hover:text-blue-400 transition-colors">
                    View History
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Manage incident history.
                  </p>
                </div>
              </button>

            </div>
          </div>
        )}

        {/* ----------------- TAB CONTENT 1: MAIN RECENT REPORTS ----------------- */}
        {activeTab === "main" && (
          <div className="rounded-2xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-xs transition-colors duration-300">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-poppins text-base font-bold text-slate-900 dark:text-white">
                Recent reports
              </h2>
              <button
                type="button"
                onClick={() => setActiveTab("history")}
                className="bg-[#0053CC] px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-700 transition-colors w-fit shadow-xs rounded-xl cursor-pointer"
              >
                View All
              </button>
            </div>

            {isLoading ? (
              <div className="py-8 flex items-center justify-center gap-2 text-xs text-slate-400">
                <Loader2 className="h-4 w-4 animate-spin text-[#0053CC]" />
                <span>Loading reports...</span>
              </div>
            ) : incidents.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                No incident reports submitted yet.
              </div>
            ) : (
              <div className="space-y-3">
                {incidents.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      setSelectedIncident(item);
                      setIsDetailsOpen(true);
                    }}
                    className="flex items-center justify-between p-3.5 sm:p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 transition-all cursor-pointer group"
                  >
                  <div className="flex items-center gap-3.5">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-14 w-16 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                    />
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm group-hover:text-[#0053CC] dark:group-hover:text-blue-400 transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {item.dateTime}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                        Plate No. <span className="text-slate-700 dark:text-slate-300">{item.plateNumber}</span> • {item.vehicleType}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                        item.status === "In Progress"
                          ? "bg-amber-100/80 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400"
                          : item.status === "Resolved"
                          ? "bg-emerald-100/80 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400"
                          : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                      }`}
                    >
                      {item.status}
                    </span>
                    <ChevronRight className="h-4 w-4 text-slate-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

        {/* ----------------- TAB CONTENT 2: INCIDENT HISTORY WITH FILTER ----------------- */}
        {activeTab === "history" && (
          <div className="space-y-6">
            
            {/* Filter Pill Tabs */}
            <div className="flex items-center justify-end overflow-x-auto pb-1">
              <div className="flex items-center gap-2">
                {["All", "In Progress", "Resolved", "Closed"].map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setHistoryFilter(tab)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                      historyFilter === tab
                        ? "bg-[#0053CC] text-white shadow-xs"
                        : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* List */}
            <div className="space-y-3">
              {filteredIncidents.length === 0 ? (
                <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border-2 border-slate-300 dark:border-slate-700 shadow-xs">
                  <p className="text-xs text-slate-400">No incident reports found for this status.</p>
                </div>
              ) : (
                filteredIncidents.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      setSelectedIncident(item);
                      setIsDetailsOpen(true);
                    }}
                    className="flex items-center justify-between p-4 rounded-2xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all cursor-pointer shadow-xs group"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-14 w-16 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                      />
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white text-sm group-hover:text-[#0053CC] dark:group-hover:text-blue-400 transition-colors">
                          {item.title}
                        </h4>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {item.dateTime}
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                          Plate No. <span className="text-slate-700 dark:text-slate-300">{item.plateNumber}</span> • {item.vehicleType}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                        item.status === "In Progress"
                          ? "bg-amber-100/80 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400"
                          : item.status === "Resolved"
                          ? "bg-emerald-100/80 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                ))
              )}
            </div>

          </div>
        )}

      </main>

      {/* ----------------- MODAL 1: NEW INCIDENT REPORT FORM (WIDE LANDSCAPE LAYOUT) ----------------- */}
      {isNewReportOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-2xl rounded-[28px] bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-2xl border border-slate-100 dark:border-slate-800 animate-in fade-in zoom-in-95 my-8">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/50 text-[#0053CC] dark:text-blue-400">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-poppins text-lg font-bold text-slate-900 dark:text-white">New Incident Report</h3>
                  <p className="text-[11px] text-slate-400">Fill in the report details below.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsNewReportOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-5 pt-4">
              
              {/* TWO COLUMN WIDE LAYOUT FOR FORM FIELDS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Vehicle Type */}
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    Vehicle Type<span className="text-red-500 ml-0.5">*</span>
                  </Label>
                  <Input
                    value={formData.vehicleType}
                    onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
                    className="h-10 rounded-xl text-xs"
                    placeholder="e.g. Car (Sedan)"
                  />
                  {formErrors.vehicleType && <span className="text-[10px] text-red-500 font-medium">{formErrors.vehicleType}</span>}
                </div>

                {/* Color */}
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    Color<span className="text-red-500 ml-0.5">*</span>
                  </Label>
                  <Input
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="h-10 rounded-xl text-xs"
                    placeholder="e.g. Silver"
                  />
                  {formErrors.color && <span className="text-[10px] text-red-500 font-medium">{formErrors.color}</span>}
                </div>

                {/* Model */}
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    Model<span className="text-red-500 ml-0.5">*</span>
                  </Label>
                  <Input
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    className="h-10 rounded-xl text-xs"
                    placeholder="e.g. Honda Civic"
                  />
                  {formErrors.model && <span className="text-[10px] text-red-500 font-medium">{formErrors.model}</span>}
                </div>

                {/* Plate Number */}
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    Plate Number<span className="text-red-500 ml-0.5">*</span>
                  </Label>
                  <Input
                    value={formData.plateNumber}
                    onChange={(e) => setFormData({ ...formData, plateNumber: e.target.value })}
                    className="h-10 rounded-xl text-xs"
                    placeholder="e.g. ABC-1234"
                  />
                  {formErrors.plateNumber && <span className="text-[10px] text-red-500 font-medium">{formErrors.plateNumber}</span>}
                </div>

              </div>

              {/* Report Type */}
              <div className="space-y-1 pt-1">
                <Label className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  Report Type<span className="text-red-500 ml-0.5">*</span>
                </Label>
                <select
                  value={formData.reportType}
                  onChange={(e) => setFormData({ ...formData, reportType: e.target.value })}
                  className="w-full h-10 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 text-xs text-slate-800 dark:text-slate-200 focus:outline-none"
                >
                  <option value="Illegal / Improper Parking">Illegal / Improper Parking</option>
                  <option value="Blocking Parking Space">Blocking Parking Space</option>
                  <option value="Obstructing Driveway">Obstructing Driveway</option>
                  <option value="Minor Scratch / Damage">Minor Scratch / Damage</option>
                  <option value="Others">Others</option>
                </select>
                {formErrors.reportType && <span className="text-[10px] text-red-500 font-medium">{formErrors.reportType}</span>}
              </div>

              {/* Upload Photo Evidence Section (Functional) */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-bold text-slate-900 dark:text-white">
                    Upload Photo Evidence <span className="text-red-500">*</span>
                  </Label>
                  {formData.photo && (
                    <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5" /> File attached
                    </span>
                  )}
                </div>

                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-5 text-center transition-colors bg-slate-50/50 dark:bg-slate-800/30 cursor-pointer ${
                    formErrors.photo 
                      ? "border-red-400 bg-red-50/20" 
                      : formData.photoPreview 
                      ? "border-emerald-500 bg-emerald-50/10" 
                      : "border-slate-300 dark:border-slate-700 hover:border-[#0053CC] dark:hover:border-blue-400"
                  }`}
                >
                  {formData.photoPreview ? (
                    <div className="flex items-center justify-center gap-4">
                      <img 
                        src={formData.photoPreview} 
                        alt="Evidence preview" 
                        className="h-16 w-20 rounded-xl object-cover border border-slate-300 shadow-xs" 
                      />
                      <div className="text-left">
                        <p className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-55">
                          {formData.photo?.name || "Uploaded Image"}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-0.5">Click to change photo</p>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <UploadCloud className="h-7 w-7 text-slate-400 mx-auto mb-1.5" />
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        Click to upload or drag photo here
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        PNG, JPG or PDF formats accepted (Max 10MB)
                      </p>
                    </div>
                  )}
                </div>
                {formErrors.photo && <span className="text-[10px] text-red-500 font-medium">{formErrors.photo}</span>}
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsNewReportOpen(false)}
                  className="h-11 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-xs font-semibold text-[#0053CC] dark:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-11 rounded-xl bg-[#0053CC] hover:bg-[#0042A5] text-white font-semibold text-xs transition-all shadow-sm cursor-pointer disabled:opacity-60 flex items-center justify-center gap-1.5"
                >
                  {isSubmitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  <span>{isSubmitting ? "Submitting..." : "Submit Report"}</span>
                </Button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ----------------- MODAL 2: INCIDENT REPORT SUBMITTED RECEIPT ----------------- */}
      {isSuccessOpen && selectedIncident && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-[28px] bg-white dark:bg-slate-900 p-6 sm:p-8 text-center shadow-2xl border border-slate-100 dark:border-slate-800 animate-in fade-in zoom-in-95">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-500">
              <CheckCircle2 className="h-6 w-6" />
            </div>

            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Incident Report Submitted!</h3>
            <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Your report has been successfully submitted. We&apos;ll review it and take appropriate action.
            </p>

            {/* Receipt Summary Box */}
            <div className="mt-4 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 space-y-2 text-left text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400 font-medium">Report ID</span>
                <span className="font-bold text-slate-900 dark:text-white">{selectedIncident.reportId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-medium">Incident Type</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedIncident.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-medium">Plate Number</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedIncident.plateNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-medium">Date and Time</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedIncident.dateTime}</span>
              </div>
            </div>

            <Button
              type="button"
              onClick={() => setIsSuccessOpen(false)}
              className="mt-6 w-full h-11 rounded-xl bg-[#0053CC] hover:bg-[#0042A5] text-white font-semibold text-xs shadow-sm cursor-pointer"
            >
              OK
            </Button>
          </div>
        </div>
      )}

      {/* ----------------- MODAL 3: INCIDENT DETAILS MODAL ----------------- */}
      {isDetailsOpen && selectedIncident && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-[28px] bg-white dark:bg-slate-900 p-6 shadow-2xl border border-slate-100 dark:border-slate-800 animate-in fade-in zoom-in-95 space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                Incident Details
              </h3>
              <button
                type="button"
                onClick={() => setIsDetailsOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Evidence Image */}
            <img
              src={selectedIncident.image}
              alt="Evidence"
              className="w-full h-48 rounded-2xl object-cover border border-slate-200 dark:border-slate-800"
            />

            {/* Title & Report ID */}
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-base dark:text-white">
                  {selectedIncident.type}
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  📅 {selectedIncident.dateTime}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                  🚘 Plate No. {selectedIncident.plateNumber} • {selectedIncident.vehicleType}
                </p>
              </div>

              <span className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg uppercase tracking-wider">
                #{selectedIncident.reportId}
              </span>
            </div>

            {/* Description */}
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Description</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                {selectedIncident.description}
              </p>
            </div>

            {/* Notice Box */}
            <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-900/40 text-blue-700 dark:text-blue-300 text-xs">
              <Info className="h-4 w-4 shrink-0 text-[#0053CC] dark:text-blue-400" />
              <p className="text-[11px] leading-tight font-medium">
                This incident is currently under review. We&apos;ll update you once there&apos;s a new status.
              </p>
            </div>

          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}