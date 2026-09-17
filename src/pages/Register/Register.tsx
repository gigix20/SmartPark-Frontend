import { useState } from "react";
import { Link } from "react-router-dom";
import { User, Car, QrCode, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-slate-900 p-4 font-sans">
      {/* Background Image with Blur */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat blur-sm brightness-75 scale-105"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1920')` }} 
      />

      {/* Main Registration Card - #F3F4F6 Background */}
      <div className="relative z-10 w-full max-w-3xl rounded-3xl bg-[#F3F4F6] p-8 shadow-2xl backdrop-blur-md md:p-10">
        
        {/* Header Section - H1 Poppins SemiBold */}
        <div className="flex items-center justify-between">
          <h1 className="text-[28px] font-semibold text-slate-900 font-poppins">Register</h1>
          <span className="text-xs font-normal text-[#9E9E9E]">Step 1 of 3</span>
        </div>

        {/* Stepper Progress Bar */}
        <div className="mt-6 flex items-center justify-between gap-2 border-b border-slate-200 pb-6">
          {/* Step 1 */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#0053CC] bg-white text-[#0053CC] shadow-sm">
              <User className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">Student's Info</p>
              <p className="text-[10px] text-[#9E9E9E]">User</p>
            </div>
          </div>

          <div className="h-0.5 flex-1 bg-[#0053CC]" />

          {/* Step 2 */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#0053CC]/40 bg-white text-[#0053CC]/60">
              <Car className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-700">Vehicle's Info</p>
              <p className="text-[10px] text-[#9E9E9E]">Vehicle type & ID</p>
            </div>
          </div>

          <div className="h-0.5 flex-1 bg-[#0053CC]/30" />

          {/* Step 3 */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#0053CC]/40 bg-white text-[#0053CC]/60">
              <QrCode className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-700">QR Code</p>
              <p className="text-[10px] text-[#9E9E9E]">Temporary QR</p>
            </div>
          </div>
        </div>

        {/* Form Inputs (2 Columns) */}
        <form className="mt-6 flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            
            {/* Username */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="username" className="text-xs font-semibold text-slate-700">
                Username<span className="text-[#EF4444]">*</span>
              </Label>
              <Input id="username" placeholder="John Doe" className="h-10 bg-white text-xs shadow-sm focus-visible:ring-[#0053CC]" required />
            </div>

            {/* School ID */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="schoolId" className="text-xs font-semibold text-slate-700">
                School ID<span className="text-[#EF4444]">*</span>
              </Label>
              <Input id="schoolId" placeholder="24-1234" className="h-10 bg-white text-xs shadow-sm focus-visible:ring-[#0053CC]" required />
            </div>

            {/* Email Address */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email" className="text-xs font-semibold text-slate-700">
                Email Address<span className="text-[#EF4444]">*</span>
              </Label>
              <Input id="email" type="email" placeholder="johndoe@gmail.com" className="h-10 bg-white text-xs shadow-sm focus-visible:ring-[#0053CC]" required />
            </div>

            {/* Phone Number */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="phone" className="text-xs font-semibold text-slate-700">
                Phone Number (optional)
              </Label>
              <Input id="phone" placeholder="+639 999 999 9999" className="h-10 bg-white text-xs shadow-sm focus-visible:ring-[#0053CC]" />
            </div>

            {/* Set Password */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password" className="text-xs font-semibold text-slate-700">
                Set Password<span className="text-[#EF4444]">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Abc12345"
                  className="h-10 bg-white pr-10 text-xs shadow-sm focus-visible:ring-[#0053CC]"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="confirmPassword" className="text-xs font-semibold text-slate-700">
                Confirm Password<span className="text-[#EF4444]">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Abc12345"
                  className="h-10 bg-white pr-10 text-xs shadow-sm focus-visible:ring-[#0053CC]"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

          </div>

          {/* Checkbox Declaration */}
          <div className="mt-2 flex items-center justify-center gap-2">
            <Checkbox id="declaration" className="data-[state=checked]:bg-[#0053CC]" required />
            <Label htmlFor="declaration" className="cursor-pointer text-[11px] font-normal text-slate-600">
              I hereby declare that the information provided is true and correct.
            </Label>
          </div>

          {/* Already have an account link */}
          <p className="mt-1 text-center text-xs text-slate-500">
            Already have an account?{" "}
            <Link to="/" className="font-semibold text-[#0053CC] hover:underline">
              Log In.
            </Link>
          </p>

          <p className="text-center text-[10px] text-[#9E9E9E]">
            By submitting, you agree to SmartPark's{" "}
            <a href="#" className="underline">
              Terms & Conditions
            </a>
          </p>

          {/* Action Buttons */}
          <div className="mt-4 flex items-center justify-end gap-3">
            <Link to="/">
              <Button type="button" variant="ghost" className="px-6 text-xs font-semibold text-slate-700 hover:bg-slate-200">
                Cancel
              </Button>
            </Link>
            <Button type="submit" className="rounded-xl bg-[#0053CC] px-8 py-2 text-xs font-semibold text-white shadow-md hover:bg-[#0053CC]/90">
              Next
            </Button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default Register;