import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ChevronLeft, AlertCircle, Lock, CheckCircle2, Info } from "lucide-react";
import bgImage from "@/assets/image-background.svg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { submitSuspensionAppeal } from "@/pages/auth/api/authApi";

export default function SuspensionAppeal() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState(() => {
    return (
      location.state?.email ||
      sessionStorage.getItem("suspended_email") ||
      ""
    );
  });

  const isAutoFilled = Boolean(
    location.state?.email || sessionStorage.getItem("suspended_email")
  );

  const [subject, setSubject] = useState("");
  const [appealReason, setAppealReason] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState("");

  const maxReasonLength = 1000;
  const maxInfoLength = 1000;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setApiError("");

    if (!email.trim() || !subject.trim() || !appealReason.trim()) {
      return;
    }

    try {
      setIsLoading(true);
      const res = await submitSuspensionAppeal({
        email: email.trim(),
        subject: subject.trim(),
        reason: appealReason.trim(),
        additionalInfo: additionalInfo.trim() || undefined,
      });

      if (res.success && res.referenceId) {
        setReferenceNumber(res.referenceId);
        setShowSuccessModal(true);
      }
    } catch (err: any) {
      setApiError(err.response?.data?.message || "Failed to submit appeal. Please check your email address.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center font-sans p-4">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat filter brightness-90"
        style={{ backgroundImage: `url(${bgImage})` }}
      />
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" />

      <div className="relative z-10 w-full max-w-xl rounded-3xl bg-white p-8 shadow-2xl sm:p-10 space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4 shrink-0">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="rounded-full p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors cursor-pointer"
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

        {apiError && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50/70 p-3 flex items-start gap-2 text-rose-700 text-xs">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-rose-500" />
            <span>{apiError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="email" className="font-semibold text-slate-800 text-xs">
                Account Email<span className="text-[#EF4444]">*</span>
              </Label>
              {isAutoFilled && (
                <span className="text-[10px] text-emerald-600 font-medium flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" /> Auto-detected from login
                </span>
              )}
            </div>
            <div className="relative">
              <Input
                type="email"
                id="email"
                placeholder="your.email@qcu.edu.ph"
                value={email}
                readOnly={isAutoFilled}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                className={`focus-visible:ring-[#0053CC] text-xs transition-colors ${
                  isAutoFilled
                    ? "bg-slate-100/80 border-slate-200 text-slate-700 font-medium cursor-not-allowed pl-8"
                    : ""
                } ${submitted && !email.trim() ? "border-[#EF4444]" : ""}`}
              />
              {isAutoFilled && (
                <Lock className="h-3.5 w-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              )}
            </div>
            {submitted && !email.trim() && (
              <p className="flex items-center gap-1 text-[11px] font-medium text-[#EF4444] mt-0.5">
                <AlertCircle className="h-3.5 w-3.5" />
                Please enter your account email.
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="subject" className="font-semibold text-slate-800 text-xs">
              Subject<span className="text-[#EF4444]">*</span>
            </Label>
            <Input
              type="text"
              id="subject"
              placeholder="e.g. Request for Suspension Review"
              value={subject}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSubject(e.target.value)}
              className={`focus-visible:ring-[#0053CC] text-xs ${
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

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="appealReason" className="font-semibold text-slate-800 text-xs">
              Appeal Reason<span className="text-[#EF4444]">*</span>
            </Label>
            <Textarea
              id="appealReason"
              rows={4}
              maxLength={maxReasonLength}
              placeholder="Explain why you are appealing this suspension..."
              value={appealReason}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setAppealReason(e.target.value)}
              className={`resize-none focus-visible:ring-[#0053CC] text-xs ${
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

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="additionalInfo" className="font-semibold text-slate-800 text-xs">
              Additional Information <span className="font-normal text-slate-500">(optional)</span>
            </Label>
            <Textarea
              id="additionalInfo"
              placeholder="Enter additional information or vehicle/incident reference details..."
              rows={3}
              maxLength={maxInfoLength}
              value={additionalInfo}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setAdditionalInfo(e.target.value)}
              className="resize-none focus-visible:ring-[#0053CC] placeholder:text-slate-400 text-xs"
            />
            <div className="flex justify-end text-[11px] text-slate-400 font-medium">
              {additionalInfo.length}/{maxInfoLength}
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#0053CC] py-5 text-sm font-semibold text-white hover:bg-[#0053CC]/90 shadow-md transition-all rounded-xl mt-2 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? "Submitting Appeal..." : "Submit Appeal"}
          </Button>
        </form>

        <div className="flex items-center justify-center gap-1.5 text-center text-xs text-slate-400 pt-2">
          <Lock className="h-3.5 w-3.5 shrink-0" />
          <span>All information submitted will be kept confidential and used only for review purposes.</span>
        </div>
      </div>

      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-2xl flex flex-col items-center gap-5">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
              <CheckCircle2 className="h-10 w-10 text-emerald-500" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-slate-900">
                Appeal Submitted Successfully!
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed px-2">
                Your appeal has been received and is now under review by the SmartPark admin.
              </p>
            </div>

            <div className="w-full border-t border-slate-100 my-1" />

            <div className="w-full space-y-2">
              <p className="text-xs font-semibold text-slate-500">Reference Number</p>
              <div className="w-full rounded-xl border-2 border-dashed border-emerald-300 bg-emerald-50/50 py-3 text-center">
                <span className="text-xl sm:text-2xl font-black tracking-wider text-emerald-600">
                  {referenceNumber || "SP-ABC-001"}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 rounded-xl bg-emerald-50/80 px-3 py-2 text-[11px] font-medium text-emerald-700 w-full">
              <Info className="h-4 w-4 shrink-0 text-emerald-600" />
              <span>Please save this reference number for future inquiries.</span>
            </div>

            <Button
              type="button"
              onClick={() => navigate("/")}
              className="w-full bg-[#0053CC] py-5 text-sm font-semibold text-white hover:bg-[#0053CC]/90 shadow-md transition-all rounded-xl mt-2 cursor-pointer"
            >
              Return Log In
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

