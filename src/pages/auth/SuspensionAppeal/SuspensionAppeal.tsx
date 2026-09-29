import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, AlertCircle, Lock, CheckCircle2, Info } from "lucide-react";
import bgImage from "@/assets/image-background.svg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

function SuspensionAppeal() {
  const navigate = useNavigate();

  const [subject, setSubject] = useState("");
  const [appealReason, setAppealReason] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState("");

  const maxReasonLength = 1000;
  const maxInfoLength = 1000;

  // Function para mag-generate ng random reference number (halimbawa: SP-ABC-001)
  const generateReferenceNumber = () => {
    const randomLetters = Math.random().toString(36).substring(2, 5).toUpperCase();
    const randomNumber = Math.floor(100 + Math.random() * 900);
    return `SP-${randomLetters}-${randomNumber}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    if (subject.trim() && appealReason.trim()) {
      // Todo: Dito tatawagin ang totoong API request
      const refNum = generateReferenceNumber();
      setReferenceNumber(refNum);
      setShowSuccessModal(true);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center font-sans p-4">
      {/* Background Image Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat filter brightness-90"
        style={{ backgroundImage: `url(${bgImage})` }}
      />
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" />

      {/* Main Card Container */}
      <div className="relative z-10 w-full max-w-xl rounded-3xl bg-white p-8 shadow-2xl sm:p-10">

        {/* Header with Back Button */}
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4 shrink-0">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="rounded-full p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Suspension Appeal
            </h2>
            <p className="text-xs text-slate-400">
              Submit an appeal request for review if you believe your account suspension was issued in error.
            </p>
          </div>
        </div>

        {/* Appeal Form */}
        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-6">
          
          {/* Subject Input */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="subject" className="font-semibold text-slate-800">
              Subject<span className="text-[#EF4444]">*</span>
            </Label>
            <Input
              type="text"
              id="subject"
              value={subject}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSubject(e.target.value)}
              className={`focus-visible:ring-[#0053CC] ${
                submitted && !subject.trim() ? "border-[#EF4444]" : ""
              }`}
            />
            {submitted && !subject.trim() && (
              <p className="flex items-center gap-1 text-[11px] font-medium text-[#EF4444] mt-0.5">
                <AlertCircle className="h-3.5 w-3.5" />
                Please enter a subject.
              </p>
            )}
          </div>

          {/* Appeal Reason Textarea */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="appealReason" className="font-semibold text-slate-800">
              Appeal Reason<span className="text-[#EF4444]">*</span>
            </Label>
            <Textarea
              id="appealReason"
              rows={4}
              maxLength={maxReasonLength}
              value={appealReason}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setAppealReason(e.target.value)}
              className={`resize-none focus-visible:ring-[#0053CC] ${
                submitted && !appealReason.trim() ? "border-[#EF4444]" : ""
              }`}
            />
            <div className="flex items-center justify-between text-[11px]">
              <div>
                {submitted && !appealReason.trim() && (
                  <p className="flex items-center gap-1 font-medium text-[#EF4444]">
                    <AlertCircle className="h-3.5 w-3.5" />
                    Please enter your reason for appeal.
                  </p>
                )}
              </div>
              <span className="text-slate-400 font-medium ml-auto">
                {appealReason.length}/{maxReasonLength}
              </span>
            </div>
          </div>

          {/* Additional Information Textarea */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="additionalInfo" className="font-semibold text-slate-800">
              Additional Information <span className="font-normal text-slate-500">(optional)</span>
            </Label>
            <Textarea
              id="additionalInfo"
              placeholder="Enter additional information here.."
              rows={3}
              maxLength={maxInfoLength}
              value={additionalInfo}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setAdditionalInfo(e.target.value)}
              className="resize-none focus-visible:ring-[#0053CC] placeholder:text-slate-400"
            />
            <div className="flex justify-end text-[11px] text-slate-400 font-medium">
              {additionalInfo.length}/{maxInfoLength}
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-[#0053CC] py-5 text-sm font-semibold text-white hover:bg-[#0053CC]/90 shadow-md transition-all rounded-xl mt-2"
          >
            Submit Appeal
          </Button>
        </form>

        {/* Bottom Disclaimer */}
        <div className="mt-6 flex items-center justify-center gap-1.5 text-center text-xs text-slate-400">
          <Lock className="h-3.5 w-3.5 shrink-0" />
          <span>All information submitted will be kept confidential and used only for review purposes.</span>
        </div>
      </div>

      {/* ================= SUCCESS MODAL ================= */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-2xl flex flex-col items-center gap-5">
            
            {/* Green Success Icon Circle */}
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
              <CheckCircle2 className="h-10 w-10 text-emerald-500" />
            </div>

            {/* Title & Description */}
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-slate-900">
                Appeal Submitted Successfully!
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed px-2">
                Your appeal has been received and is now under review by the SmartPark admin.
              </p>
            </div>

            <div className="w-full border-t border-slate-100 my-1" />

            {/* Reference Number Label & Box */}
            <div className="w-full space-y-2">
              <p className="text-xs font-semibold text-slate-500">Reference Number</p>
              
              <div className="w-full rounded-xl border-2 border-dashed border-emerald-300 bg-emerald-50/50 py-3 text-center">
                <span className="text-xl sm:text-2xl font-black tracking-wider text-emerald-600">
                  {referenceNumber || "SP-ABC-001"}
                </span>
              </div>
            </div>

            {/* Reminder Note */}
            <div className="flex items-center justify-center gap-2 rounded-xl bg-emerald-50/80 px-3 py-2 text-[11px] font-medium text-emerald-700 w-full">
              <Info className="h-4 w-4 shrink-0 text-emerald-600" />
              <span>Please save this reference number for future inquiries.</span>
            </div>

            {/* Return Log In Button */}
            <Button
              type="button"
              onClick={() => navigate("/")}
              className="w-full bg-[#0053CC] py-5 text-sm font-semibold text-white hover:bg-[#0053CC]/90 shadow-md transition-all rounded-xl mt-2"
            >
              Return Log In
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SuspensionAppeal;