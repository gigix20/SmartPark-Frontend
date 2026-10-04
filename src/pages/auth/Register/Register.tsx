import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import logo from "@/assets/smartpark-logo.svg";
import { registerUser } from "../api/authApi";

// Zod Validation Schema
const registerSchema = z
  .object({
    firstName: z
      .string()
      .min(2, "First Name must be at least 2 characters."),
    lastName: z
      .string()
      .min(2, "Last Name must be at least 2 characters."),
    email: z
      .string()
      .email("Invalid email address format.")
      .refine((val) => val.toLowerCase().endsWith("@gmail.com"), {
        message: "Please use a valid Gmail address (@gmail.com).",
      }),
    schoolId: z
      .string()
      .min(1, "Student / Employee ID is required."),
    phone: z.string().optional(),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long.")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter (A-Z).")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter (a-z).")
      .regex(/[0-9]/, "Password must contain at least one number (0-9)."),
    confirmPassword: z.string().min(1, "Please confirm your password."),
    declaration: z.boolean().refine((val) => val === true, {
      message: "Please confirm that the information provided is correct.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match. Please re-enter.",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Status & Feedback States
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  // React Hook Form Setup
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onSubmit",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      schoolId: "",
      phone: "",
      password: "",
      confirmPassword: "",
      declaration: false,
    },
  });

  // Watch field values for custom formatting
  const watchFirstName = watch("firstName");
  const watchLastName = watch("lastName");
  const watchSchoolId = watch("schoolId");
  const watchPhone = watch("phone");
  const watchDeclaration = watch("declaration");

  // Helper function to format names (capitalize first letter & remove numbers/symbols)
  const formatName = (value: string) => {
    const cleaned = value.replace(/[^a-zA-Z\s-]/g, "");
    return cleaned.replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const handleRegister = async (data: RegisterFormData) => {
    setErrorMessage("");
    setIsLoading(true);

    try {
      const res = await registerUser({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        schoolId: data.schoolId,
        phone: data.phone?.trim() ? data.phone.trim() : undefined,
        password: data.password,
      });

      // Store authenticated session
      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));

      setIsSuccess(true);

      // Auto-redirect to dashboard after 2 seconds
      setTimeout(() => {
        navigate("/Login");
      }, 2000);
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        "Registration failed. Please verify your details and try again.";
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  // Kunin ang unang lumabas na error message mula sa Zod validation
  const firstError = Object.values(errors)[0]?.message || errorMessage;

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

        {/* Error Notification */}
        {firstError && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-center text-xs font-medium text-[#EF4444]">
            {firstError}
          </div>
        )}

        {/* Form Inputs */}
        <form className="mt-6 flex flex-col gap-3.5" onSubmit={handleSubmit(handleRegister)}>
          {/* First Name & Last Name (Side by Side) */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <Label
                htmlFor="firstName"
                className="text-xs font-semibold text-slate-800"
              >
                First Name<span className="text-[#EF4444]">*</span>
              </Label>
              <Input
                id="firstName"
                placeholder="Enter your first name"
                value={watchFirstName}
                {...register("firstName")}
                onChange={(e) =>
                  setValue("firstName", formatName(e.target.value), {
                    shouldValidate: true,
                  })
                }
                className="h-10 rounded-xl bg-white text-xs shadow-sm focus-visible:ring-[#0053CC]"
                disabled={isLoading || isSuccess}
              />
            </div>

            <div className="flex flex-col gap-1">
              <Label
                htmlFor="lastName"
                className="text-xs font-semibold text-slate-800"
              >
                Last Name<span className="text-[#EF4444]">*</span>
              </Label>
              <Input
                id="lastName"
                placeholder="Enter your last name"
                value={watchLastName}
                {...register("lastName")}
                onChange={(e) =>
                  setValue("lastName", formatName(e.target.value), {
                    shouldValidate: true,
                  })
                }
                className="h-10 rounded-xl bg-white text-xs shadow-sm focus-visible:ring-[#0053CC]"
                disabled={isLoading || isSuccess}
              />
            </div>
          </div>

          {/* Email Address */}
          <div className="flex flex-col gap-1">
            <Label
              htmlFor="email"
              className="text-xs font-semibold text-slate-800"
            >
              Email Address<span className="text-[#EF4444]">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your Gmail address"
              {...register("email")}
              className="h-10 rounded-xl bg-white text-xs shadow-sm focus-visible:ring-[#0053CC]"
              disabled={isLoading || isSuccess}
            />
          </div>

          {/* Student / Employee ID */}
          <div className="flex flex-col gap-1">
            <Label
              htmlFor="schoolId"
              className="text-xs font-semibold text-slate-800"
            >
              Student / Employee ID<span className="text-[#EF4444]">*</span>
            </Label>
            <Input
              id="schoolId"
              placeholder="00-0000"
              value={watchSchoolId}
              {...register("schoolId")}
              onChange={(e) => {
                let value = e.target.value.replace(/\D/g, ""); // numbers only

                if (value.length > 2) {
                  value = value.slice(0, 2) + "-" + value.slice(2, 6);
                }

                setValue("schoolId", value, { shouldValidate: true });
              }}
              className="h-10 rounded-xl bg-white text-xs shadow-sm focus-visible:ring-[#0053CC]"
              disabled={isLoading || isSuccess}
            />
          </div>

          {/* Phone Number (Optional) */}
          <div className="flex flex-col gap-1">
            <Label
              htmlFor="phone"
              className="text-xs font-semibold text-slate-800"
            >
              Phone Number
              <span className="font-normal text-slate-500">(optional)</span>
            </Label>
            <Input
              id="phone"
              placeholder="09XX XXX XXXX"
              value={watchPhone}
              {...register("phone")}
              onChange={(e) => {
                let value = e.target.value.replace(/\D/g, "");
                if (value.length >= 1 && value[0] !== "0") {
                  return;
                }
                if (value.length >= 2 && !value.startsWith("09")) {
                  return;
                }

                setValue("phone", value.slice(0, 11), {
                  shouldValidate: true,
                });
              }}
              maxLength={11}
              className="h-10 rounded-xl bg-white text-xs shadow-sm focus-visible:ring-[#0053CC]"
              disabled={isLoading || isSuccess}
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1">
            <Label
              htmlFor="password"
              className="text-xs font-semibold text-slate-800"
            >
              Password<span className="text-[#EF4444]">*</span>
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a strong password (min 8 chars)"
                {...register("password")}
                className="h-10 rounded-xl bg-white pr-10 text-xs shadow-sm focus-visible:ring-[#0053CC]"
                disabled={isLoading || isSuccess}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                disabled={isLoading || isSuccess}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col gap-1">
            <Label
              htmlFor="confirmPassword"
              className="text-xs font-semibold text-slate-800"
            >
              Confirm Password<span className="text-[#EF4444]">*</span>
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Repeat your password"
                {...register("confirmPassword")}
                className="h-10 rounded-xl bg-white pr-10 text-xs shadow-sm focus-visible:ring-[#0053CC]"
                disabled={isLoading || isSuccess}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                disabled={isLoading || isSuccess}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Checkbox Declaration */}
          <div className="mt-1 flex items-center gap-2">
            <Checkbox
              id="declaration"
              checked={watchDeclaration}
              onCheckedChange={(checked) =>
                setValue("declaration", checked === true, {
                  shouldValidate: true,
                })
              }
              className="data-[state=checked]:bg-[#0053CC]"
              disabled={isLoading || isSuccess}
            />
            <Label
              htmlFor="declaration"
              className="cursor-pointer text-[11px] font-normal text-slate-600"
            >
              I confirm that the information provided is correct.
            </Label>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading || isSuccess}
            className="mt-2 h-10 w-full rounded-xl bg-[#0053CC] text-xs font-semibold text-white shadow-md hover:bg-[#0053CC]/90 disabled:opacity-50"
          >
            {isLoading ? "Creating Account..." : "Register"}
          </Button>

          {/* Already have an account link */}
          <p className="mt-2 text-center text-xs text-slate-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-[#0053CC] hover:underline"
            >
              Log In.
            </Link>
          </p>

          <p className="text-center text-[10px] text-slate-400">
            By registering, you agree to SmartPark's{" "}
            <Link to="/terms-and-conditions" className="underline hover:text-slate-700 transition-colors">
              Terms & Conditions
            </Link>
          </p>
        </form>
      </div>

      {/* Right Side: Blue Gradient Banner (Full height, rounded-r-3xl) */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden rounded-r-3xl bg-linear-to-b from-[#d0e1ff] via-[#4a82f6] to-[#1d58d8] p-10 text-white md:flex">
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

      {/* SUCCESS MODAL OVERLAY */}
      {isSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-2xl transition-all animate-in fade-in zoom-in-95">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-[#008080]">
              <CheckCircle2 className="h-9 w-9 stroke-[1.75]" />
            </div>

            <h3 className="mt-4 font-poppins text-xl font-bold text-slate-900">
              Account Created!
            </h3>
            <p className="mt-1 text-xs text-slate-400">
              Welcome to QCU SmartPark. Redirecting to your login page...
            </p>

            <Button
              type="button"
              onClick={() => navigate("/Login")}
              className="mt-6 w-full rounded-xl bg-[#0053CC] py-5 text-xs font-semibold text-white hover:bg-[#0053CC]/90 shadow-sm"
            >
              Continue to Login
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Register;