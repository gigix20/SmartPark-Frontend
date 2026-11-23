import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle2, AlertCircle, Loader2, ArrowRight, ShieldCheck, Clock } from "lucide-react";
import bgImage from "@/assets/image-background.svg";
import { Button } from "@/components/ui/button";
import { activateAccount } from "../api/authApi";

export default function AccountActivation() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [isLoading, setIsLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isExpired, setIsExpired] = useState(false);
  const [message, setMessage] = useState("");
  const [activatedUser, setActivatedUser] = useState<{
    firstName: string;
    email: string;
    role: string;
  } | null>(null);

  useEffect(() => {
    async function verifyAndActivate() {
      if (!token) {
        setIsLoading(false);
        setIsExpired(true);
        setMessage("No activation token was provided in the invitation link. Please check your email.");
        return;
      }

      try {
        setIsLoading(true);
        const res = await activateAccount(token);
        if (res.success) {
          setIsSuccess(true);
          setMessage(res.message);
          if (res.user) {
            setActivatedUser(res.user);
          }
        } else {
          setIsExpired(res.expired || false);
          setMessage(res.message || "Failed to activate account. The invitation link may have expired.");
        }
      } catch (err: any) {
        const backendMsg = err.response?.data?.message;
        const expired = err.response?.data?.expired;
        setIsExpired(Boolean(expired));
        setMessage(
          backendMsg ||
            "This invitation link has expired or is invalid. Activation links are valid for 3 days. Please request a new invitation."
        );
      } finally {
        setIsLoading(false);
      }
    }

    verifyAndActivate();
  }, [token]);

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center font-sans p-4">
      {/* Background Image and Blur */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat filter brightness-90"
        style={{ backgroundImage: `url(${bgImage})` }}
      />
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" />

      {/* Main Content Box */}
      <div className="relative z-10 w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-2xl sm:p-10 space-y-6">
        {isLoading ? (
          <div className="py-10 space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-[#0053CC]">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-slate-900">Activating Account</h2>
              <p className="text-xs text-slate-500">
                Please wait while we verify your 3-day staff invitation token...
              </p>
            </div>
          </div>
        ) : isSuccess ? (
          <div className="space-y-5 animate-in zoom-in-95">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="h-10 w-10 stroke-[2]" />
            </div>

            <div className="space-y-1.5">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                Account Activated!
              </h2>
              <p className="text-xs text-slate-500 leading-relaxed px-2">
                {message || "Your SmartPark staff account is now active and ready for use."}
              </p>
            </div>

            {activatedUser && (
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4 text-xs text-left space-y-1">
                <p className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider">
                  Verified Account Profile
                </p>
                <p className="font-bold text-slate-900 text-sm">
                  {activatedUser.firstName}
                </p>
                <p className="text-slate-600 text-[11px]">{activatedUser.email}</p>
                <div className="pt-1">
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white text-emerald-700 border border-emerald-200">
                    Role: {activatedUser.role}
                  </span>
                </div>
              </div>
            )}

            <div className="rounded-xl bg-blue-50/60 border border-blue-100 p-3 text-[11px] text-blue-700 flex items-center justify-center gap-1.5">
              <ShieldCheck className="h-4 w-4 shrink-0" />
              <span>You may now log in using your set password.</span>
            </div>

            <Button
              type="button"
              onClick={() => navigate("/login")}
              className="w-full bg-[#0053CC] py-5 text-sm font-semibold text-white hover:bg-[#0053CC]/90 shadow-md transition-all rounded-xl cursor-pointer"
            >
              <span>Proceed to Log In</span>
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        ) : (
          <div className="space-y-5 animate-in zoom-in-95">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-50 text-rose-500">
              {isExpired ? (
                <Clock className="h-10 w-10 stroke-[1.75]" />
              ) : (
                <AlertCircle className="h-10 w-10 stroke-[1.75]" />
              )}
            </div>

            <div className="space-y-1.5">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                {isExpired ? "Invitation Expired" : "Activation Failed"}
              </h2>
              <p className="text-xs text-slate-500 leading-relaxed px-2">
                {message}
              </p>
            </div>

            <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-3.5 text-xs text-amber-800 text-left space-y-1">
              <p className="font-bold flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                3-Day Expiration Policy
              </p>
              <p className="text-[11px] text-amber-700 leading-relaxed">
                Staff invitation links expire automatically after 72 hours for security reasons. Please reach out to your Super Administrator to issue a new activation invitation.
              </p>
            </div>

            <Button
              type="button"
              onClick={() => navigate("/login")}
              variant="outline"
              className="w-full border-slate-200 py-5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all rounded-xl cursor-pointer"
            >
              Return to Log In
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
