import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import logo from "../../assets/logo.svg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

function Login() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex min-h-screen w-full font-sans">
      {/* Left Panel - Navy Blue Gradient */}
      <div className="relative hidden min-h-screen w-1/2 flex-col justify-between overflow-hidden bg-linear-to-b from-[#b0c4de] via-[#4a80e2] to-[#2563eb] p-12 text-white md:flex">
        
        {/* Empty top spacing para sa vertical balance */}
        <div />

        {/* Main Content (Logo sa Gitna) */}
        <div className="flex items-center justify-center gap-6">
          <img
            src={logo}
            alt="SmartPark Logo"
            className="h-64 w-auto shrink-0 object-contain md:h-80 lg:h-112" 
          />
        </div>

        {/* Bottom Section */}
        <div className="z-10 flex items-center gap-3">
          <div className="flex -space-x-2 overflow-hidden">
            <div className="inline-block h-8 w-8 rounded-full border-2 border-white bg-slate-200" />
            <div className="inline-block h-8 w-8 rounded-full border-2 border-white bg-slate-300" />
            <div className="inline-block h-8 w-8 rounded-full border-2 border-white bg-slate-400" />
          </div>
          <span className="text-sm font-semibold text-white">+100 active users</span>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex w-full flex-col justify-center bg-[#F3F4F6] px-8 py-12 md:w-1/2 md:px-16 lg:px-24">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg md:p-10">
          <h2 className="font-poppins text-[28px] font-semibold text-slate-900">Log In</h2>
          <p className="mt-2 text-sm text-[#9E9E9E]">
            Enter your credentials to manage your parking access.
          </p>

          {/* Form */}
          <form className="mt-8 flex flex-col gap-5" onSubmit={(e) => e.preventDefault()}>
            
            {/* Email / ID Input */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email" className="font-semibold text-slate-800">
                Email Address or School ID<span className="text-[#EF4444]">*</span>
              </Label>
              <Input
                type="text"
                id="email"
                placeholder="juandelacruz@gmail.com or 24-1478"
                className="focus-visible:ring-[#0053CC]"
                required
              />
            </div>

            {/* Password Input Field with Toggle */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password" className="font-semibold text-slate-800">
                Password<span className="text-[#EF4444]">*</span>
              </Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="••••••••"
                  className="pr-10 focus-visible:ring-[#0053CC]"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Options */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Checkbox id="remember" className="data-[state=checked]:bg-[#0053CC]" />
                <Label htmlFor="remember" className="cursor-pointer text-xs font-normal text-slate-700">
                  Remember this device
                </Label>
              </div>
              <a href="#" className="font-medium text-[#0053CC] hover:underline">
                Forgot Password?
              </a>
            </div>

            {/* Submit Button - Navy Blue Palette (#0053CC) */}
            <Button
              type="submit"
              className="mt-2 w-full bg-[#0053CC] py-5 text-sm font-semibold hover:bg-[#0053CC]/90"
            >
              Sign In
            </Button>
          </form>

          {/* Footer Links */}
          <p className="mt-6 text-sm text-slate-700">
            New user?{" "}
            <Link to="/register" className="font-semibold text-[#0053CC] underline">
              Register your vehicle
            </Link>
          </p>
          <p className="mt-4 text-xs text-[#9E9E9E]">
            By logging in, you agree to SmartPark’s{" "}
            <a href="#" className="underline">
              Terms & Conditions
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;