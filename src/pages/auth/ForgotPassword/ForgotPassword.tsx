import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail } from "lucide-react";
import logo from "../../../assets/smartpark-logo.svg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitted email:", email);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center p-4">
      {/* Background Image / Blur Container */}
      <div 
        className="absolute inset-0 -z-10 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/assets/bg-building.jpg')" }} // Palitan mo ng path ng background image mo
      >
        <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm" />
      </div>

      {/* Main Card */}
      <div className="w-full max-w-lg rounded-[28px] bg-white p-8 sm:p-10 shadow-2xl">
        {/* Logo Header */}
        <div className="flex justify-center mb-6">
          <img 
            src={logo}
            alt="SmartPark Logo" 
            className="h-16 object-contain"
          />
        </div>

        {/* Title & Subtitle */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B132B]">
            Forgot Password
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-500 font-normal">
            Enter your email address below and we&apos;ll help you regain access to your account.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2 text-left mb-6">
            <Label htmlFor="email" className="text-xs sm:text-sm font-semibold text-slate-900">
              Email Address<span className="text-red-500 ml-0.5">*</span>
            </Label>
            
            <div className="relative">
              <Input
                id="email"
                type="email"
                placeholder="Enter your email address"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 rounded-xl border-slate-300 pr-10 text-xs sm:text-sm placeholder:text-slate-400 focus-visible:ring-[#0053CC]"
              />
              <Mail className="absolute right-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Continue Button */}
          <Button
            type="submit"
            className="w-full h-12 rounded-xl bg-[#0053CC] hover:bg-[#0042A5] text-white font-semibold text-sm transition-all shadow-sm"
          >
            Continue
          </Button>
          

          {/* Cancel Button */}
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate("/")}
            className="w-full h-12 rounded-xl border border-slate-200 text-l font-semibold text-[#0053CC] hover:bg-slate-50"
          >
            Cancel
          </Button>
        </form>

        {/* Divider Line */}
        <div className="my-6 border-t border-slate-100" />

        {/* Footer Note */}
        <div className="text-center text-[11px] sm:text-xs text-slate-400 space-y-0.5">
          <p>Didn&apos;t receive an email?</p>
          <p>Try checking your junk or spam folders.</p>
        </div>

      </div>
    </div>
  );
}