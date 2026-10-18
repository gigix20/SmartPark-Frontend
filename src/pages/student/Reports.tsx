import { useState } from "react";
import { 
  FileText, 
  History, 
  UploadCloud, 
  CheckCircle2, 
  X, 
  ChevronRight, 
  ArrowLeft,
  Info
} from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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

  // Active View Tab: 'main' (Home/Recent) o 'history' (Full History View)
  const [activeTab, setActiveTab] = useState<"main" | "history">("main");
  
  // History Filter State: 'All' | 'In Progress' | 'Resolved' | 'Closed'
  const [historyFilter, setHistoryFilter] = useState<string>("All");

  // Mock List ng Incidents
  const [incidents, setIncidents] = useState<Incident[]>([
    {
      id: "1",
      reportId: "DFGA12VDJA",
      title: "Minor Scratch - Sedan",
      type: "Minor Scratch",
      vehicleType: "Car (Sedan)",
      color: "White",
      model: "Toyota Vios",
      plateNumber: "ABC-1234",
      dateTime: "October 11, 2026 • 10:30AM",
      status: "In Progress",
      image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=500",
      description: "Vehicle is parked overlapping the line, rendering the adjacent space completely inaccessible for other cars. Checked around 10:15 AM."
    },
    {
      id: "2",
      reportId: "DFGA99XYZ1",
      title: "Parking Violation",
      type: "Illegal / Improper Parking",
      vehicleType: "Motorcycle",
      color: "Black",
      model: "Yamaha NMAX",
      plateNumber: "XYZ-5678",
      dateTime: "October 11, 2026 • 09:15AM",
      status: "Resolved",
      image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=500",
      description: "Motorcycle parked blocking the main driveway near the Gate 1 entrance."
    }
  ]);

  // Modal States
  const [isNewReportOpen, setIsNewReportOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  
  // Selected Item for Details or Success Receipt
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);

  // Form Fields & Errors
  const [formData, setFormData] = useState({
    vehicleType: "Car (Sedan)",
    color: "Silver",
    model: "Honda Civic",
    plateNumber: "ABC-1234",
    reportType: "Blocking Parking Space",
    photo: null as File | null,
  });

  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: { [key: string]: string } = {};

    if (!formData.vehicleType) errors.vehicleType = "Vehicle type is required.";
    if (!formData.color) errors.color = "Color is required.";
    if (!formData.model) errors.model = "Model is required.";
    if (!formData.plateNumber) errors.plateNumber = "Plate number is required.";
    if (!formData.reportType) errors.reportType = "Report type is required.";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const newInc: Incident = {
      id: Date.now().toString(),
      reportId: `DFGA${Math.floor(1000 + Math.random() * 9000)}`,
      title: `${formData.reportType} - ${formData.vehicleType}`,
      type: formData.reportType,
      vehicleType: formData.vehicleType,
      color: formData.color,
      model: formData.model,
      plateNumber: formData.plateNumber,
      dateTime: "October 18, 2026 • 10:23AM",
      status: "In Progress",
      image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=500",
      description: "Reported incident directly by user. Pending supervisor review."
    };

    setIncidents([newInc, ...incidents]);
    setSelectedIncident(newInc);
    setIsNewReportOpen(false);
    setIsSuccessOpen(true);
    setFormErrors({});
  };

  // Filtered list for History View
  const filteredIncidents = incidents.filter((item) => {
    if (historyFilter === "All") return true;
    return item.status === historyFilter;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans pb-28 transition-colors duration-300">
      {/* Top Header */}
      <Header currentUser={currentUser} />

      {/* Main Content Area */}
      <main className="mx-auto max-w-5xl p-4 sm:p-8 space-y-6">
        
        {/* BANNER HEADER */}
        <div className="rounded-[24px] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm transition-colors duration-300">
          <h1 className="font-poppins text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
            {activeTab === "main" ? "Incident Report" : "Incident History"}
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Report accidents, damages, or safety concerns directly to fleet supervisors and receive official digital receipts.
          </p>
        </div>

        {/* TOP ACTION CARDS (Report New Incident / View History) */}
        {activeTab === "main" && (
          <div className="rounded-[24px] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-6 shadow-sm transition-colors duration-300">
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
          <div className="rounded-[24px] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm transition-colors duration-300">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-poppins text-base font-bold text-slate-900 dark:text-white">
                Recent reports
              </h2>
              <button
                type="button"
                onClick={() => setActiveTab("history")}
                className="text-xs font-bold text-[#0053CC] dark:text-blue-400 hover:underline cursor-pointer"
              >
                View All
              </button>
            </div>

            <div className="space-y-3">
              {incidents.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    setSelectedIncident(item);
                    setIsDetailsOpen(true);
                  }}
                  className="flex items-center justify-between p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 transition-all cursor-pointer group"
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
                    <ChevronRight className="h-4 w-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ----------------- TAB CONTENT 2: INCIDENT HISTORY WITH FILTER ----------------- */}
        {activeTab === "history" && (
          <div className="space-y-6">
            
            {/* Filter Pill Tabs */}
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setActiveTab("main")}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#0053CC] dark:hover:text-blue-400 cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" /> Back to Summary
              </button>

              <div className="flex items-center gap-2 overflow-x-auto pb-1">
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
                <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-[24px] border border-slate-200 dark:border-slate-800">
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
                    className="flex items-center justify-between p-4 rounded-[20px] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all cursor-pointer shadow-xs group"
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

      {/* ----------------- MODAL 1: NEW INCIDENT REPORT FORM ----------------- */}
      {isNewReportOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-slate-900/50 dark:bg-slate-950/80 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-lg rounded-[28px] bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-2xl border border-slate-100 dark:border-slate-800 animate-in fade-in zoom-in-95 my-8">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/50 text-[#0053CC] dark:text-blue-400">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-poppins text-lg font-bold text-slate-900 dark:text-white">New Incident Report</h3>
                  <p className="text-[11px] text-slate-400">Add a new report.</p>
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
              
              {/* SECTION 1: Vehicle Details */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  1. Vehicle Details
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                      Vehicle Type<span className="text-red-500 ml-0.5">*</span>
                    </Label>
                    <Input
                      value={formData.vehicleType}
                      onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
                      className="h-10 rounded-xl text-xs"
                    />
                    {formErrors.vehicleType && <span className="text-[10px] text-red-500 font-medium">{formErrors.vehicleType}</span>}
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                      Color<span className="text-red-500 ml-0.5">*</span>
                    </Label>
                    <Input
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      className="h-10 rounded-xl text-xs"
                    />
                    {formErrors.color && <span className="text-[10px] text-red-500 font-medium">{formErrors.color}</span>}
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                      Model<span className="text-red-500 ml-0.5">*</span>
                    </Label>
                    <Input
                      value={formData.model}
                      onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                      className="h-10 rounded-xl text-xs"
                    />
                    {formErrors.model && <span className="text-[10px] text-red-500 font-medium">{formErrors.model}</span>}
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                      Plate Number<span className="text-red-500 ml-0.5">*</span>
                    </Label>
                    <Input
                      value={formData.plateNumber}
                      onChange={(e) => setFormData({ ...formData, plateNumber: e.target.value })}
                      className="h-10 rounded-xl text-xs"
                    />
                    {formErrors.plateNumber && <span className="text-[10px] text-red-500 font-medium">{formErrors.plateNumber}</span>}
                  </div>
                </div>
              </div>

              {/* SECTION 2: Report Details */}
              <div className="space-y-2 border-t border-slate-100 dark:border-slate-800 pt-3">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  2. Report Details
                </h4>

                <div className="space-y-1">
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
                </div>
              </div>

              {/* SECTION 3: Upload Photo Evidence */}
              <div className="space-y-2 border-t border-slate-100 dark:border-slate-800 pt-3">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  3. Upload Photo Evidence
                </h4>
                <p className="text-[10px] text-red-500 font-medium">*Required</p>

                <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-6 text-center hover:border-[#0053CC] dark:hover:border-blue-400 transition-colors bg-slate-50/50 dark:bg-slate-800/30 cursor-pointer">
                  <UploadCloud className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Click to upload or drag photo here
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1">
                    PNG, JPG or PDF formats accepted (Max 10MB)
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-4">
                <Button
                  type="submit"
                  className="w-full h-11 rounded-xl bg-[#0053CC] hover:bg-[#0042A5] text-white font-semibold text-xs transition-all shadow-sm cursor-pointer"
                >
                  Submit
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsNewReportOpen(false)}
                  className="w-full h-11 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-xs font-semibold text-[#0053CC] dark:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </Button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ----------------- MODAL 2: INCIDENT REPORT SUBMITTED RECEIPT ----------------- */}
      {isSuccessOpen && selectedIncident && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-slate-900/50 dark:bg-slate-950/80 backdrop-blur-xs p-4">
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
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-slate-900/50 dark:bg-slate-950/80 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-[28px] bg-white dark:bg-slate-900 p-6 shadow-2xl border border-slate-100 dark:border-slate-800 animate-in fade-in zoom-in-95 space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <button
                type="button"
                onClick={() => setIsDetailsOpen(false)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-[#0053CC] dark:hover:text-blue-400 cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" /> Incident Details
              </button>
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
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
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
                REPORT ID: #{selectedIncident.reportId}
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