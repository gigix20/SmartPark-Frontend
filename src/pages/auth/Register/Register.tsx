import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import logo from "@/assets/smartpark-logo.svg"; // Palitan ang path ayon sa kinalalagyan ng logo mo

function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="flex min-h-screen w-full bg-white font-sans">
      {/* Left Side: Registration Form */}
      <div className="flex w-full flex-col justify-center px-8 py-6 md:w-1/2 md:px-16 lg:px-20">
        
        {/* Header */}
        <div className="text-center">
          <h1 className="font-poppins text-3xl font-extrabold text-slate-900">
            Register
          </h1>
          <p className="mt-2 text-xs text-slate-500">
            Enter your credentials to manage your parking access.
          </p>
        </div>

        {/* Form Inputs */}
        <form
          className="mt-6 flex flex-col gap-3.5"
          onSubmit={(e) => e.preventDefault()}
        >
          {/* First Name & Last Name (Side by Side) */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <Label htmlFor="firstName" className="text-xs font-semibold text-slate-800">
                First Name<span className="text-[#EF4444]">*</span>
              </Label>
              <Input
                id="firstName"
                placeholder="Enter your first name"
                className="h-10 rounded-xl bg-white text-xs shadow-sm focus-visible:ring-[#0053CC]"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <Label htmlFor="lastName" className="text-xs font-semibold text-slate-800">
                Last Name<span className="text-[#EF4444]">*</span>
              </Label>
              <Input
                id="lastName"
                placeholder="Enter your last name"
                className="h-10 rounded-xl bg-white text-xs shadow-sm focus-visible:ring-[#0053CC]"
                required
              />
            </div>
          </div>

          {/* Email Address */}
          <div className="flex flex-col gap-1">
            <Label htmlFor="email" className="text-xs font-semibold text-slate-800">
              Email Address<span className="text-[#EF4444]">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your QCU email address"
              className="h-10 rounded-xl bg-white text-xs shadow-sm focus-visible:ring-[#0053CC]"
              required
            />
          </div>

          {/* Student / Employee ID */}
          <div className="flex flex-col gap-1">
            <Label htmlFor="schoolId" className="text-xs font-semibold text-slate-800">
              Student / Employee ID<span className="text-[#EF4444]">*</span>
            </Label>
            <Input
              id="schoolId"
              placeholder="Enter QCU identification number"
              className="h-10 rounded-xl bg-white text-xs shadow-sm focus-visible:ring-[#0053CC]"
              required
            />
          </div>

          {/* Phone Number (Optional) */}
          <div className="flex flex-col gap-1">
            <Label htmlFor="phone" className="text-xs font-semibold text-slate-800">
              Phone Number<span className="font-normal text-slate-500">(optional)</span>
            </Label>
            <Input
              id="phone"
              placeholder="0912 345 6789"
              className="h-10 rounded-xl bg-white text-xs shadow-sm focus-visible:ring-[#0053CC]"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1">
            <Label htmlFor="password" className="text-xs font-semibold text-slate-800">
              Password<span className="text-[#EF4444]">*</span>
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a strong password"
                className="h-10 rounded-xl bg-white pr-10 text-xs shadow-sm focus-visible:ring-[#0053CC]"
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
          <div className="flex flex-col gap-1">
            <Label htmlFor="confirmPassword" className="text-xs font-semibold text-slate-800">
              Confirm Password<span className="text-[#EF4444]">*</span>
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Repeat your password"
                className="h-10 rounded-xl bg-white pr-10 text-xs shadow-sm focus-visible:ring-[#0053CC]"
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

          {/* Checkbox Declaration */}
          <div className="mt-1 flex items-center gap-2">
            <Checkbox id="declaration" className="data-[state=checked]:bg-[#0053CC]" required />
            <Label htmlFor="declaration" className="cursor-pointer text-[11px] font-normal text-slate-600">
              I confirm that the information provided is correct.
            </Label>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="mt-2 h-10 w-full rounded-xl bg-[#0053CC] text-xs font-semibold text-white shadow-md hover:bg-[#0053CC]/90"
          >
            Register
          </Button>

          {/* Already have an account link */}
          <p className="mt-2 text-center text-xs text-slate-400">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-[#0053CC] hover:underline">
              Log In.
            </Link>
          </p>

          <p className="text-center text-[10px] text-slate-400">
            By logging in, you agree to SmartPark's{" "}
            <Link to="/terms-and-conditions" className="underline">
              Terms & Conditions
            </Link>
          </p>
        </form>
      </div>

      {/* Right Side: Blue Gradient Banner (Full height, rounded-r-3xl) */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden rounded-r-3xl bg-gradient-to-b from-[#d0e1ff] via-[#4a82f6] to-[#1d58d8] p-10 text-white md:flex">
        <div />

        {/* Logo & Branding */}
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <img
            src={logo}
            alt="SmartPark Logo"
            className="h-64 w-auto shrink-0 object-contain md:h-80 lg:h-112"
          />
        </div>

        {/* Footer inside Right Panel */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2 overflow-hidden">
              <div className="inline-block h-8 w-8 rounded-full border-2 border-white bg-slate-100" />
              <div className="inline-block h-8 w-8 rounded-full border-2 border-white bg-slate-200" />
              <div className="inline-block h-8 w-8 rounded-full border-2 border-white bg-slate-300" />
            </div>
            <span className="text-xs font-bold text-white">+ 100 users</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;