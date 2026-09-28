import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { 
  ChevronLeft, 
  User, 
  Mail, 
  Phone, 
  CreditCard, 
  Car, 
  History, 
  ShieldCheck, 
  Lock,
  FileText,
  AlertTriangle,
  Scale,
  Server,
  HelpCircle,
  Eye,
  Key,
  HardDrive
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

export default function TermsAndCondition() {
  const navigate = useNavigate();
  const [isChecked, setIsChecked] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 sm:p-6">
      {/* Container */}
      <div className="w-full max-w-4xl bg-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col max-h-[92vh]">
        
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
              Terms of Service &amp; Data Privacy Policy
            </h2>
            <p className="text-xs text-slate-400">
              Simple Rules &amp; Guidelines for SmartPark Users
            </p>
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="overflow-y-auto pr-3 my-6 space-y-6 text-slate-600 text-xs sm:text-sm leading-relaxed">
          
          {/* Warning Banner */}
          <div className="rounded-2xl bg-amber-50 border border-amber-200/80 p-4 text-amber-900 shrink-0">
            <p className="font-semibold text-amber-950 mb-1 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
              IMPORTANT NOTICE BEFORE USING SMARTPARK
            </p>
            <p className="text-xs text-amber-800/90 leading-relaxed">
              By using the SmartPark system, you agree to all the rules listed here. If you do not agree, please do not use the app or enter the parking area.
            </p>
          </div>

          {/* SECTION 1: ACCOUNT RULES */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                <FileText className="h-4 w-4" />
              </div>
              <span className="text-blue-600">1. Account &amp; Registration Rules</span>
            </div>
            <div className="pl-9 space-y-2 text-xs text-slate-600">
              <p>
                <strong>1.1 Accurate Information.</strong> You must provide your real full name, valid ID number, and accurate vehicle license plate details. Fake accounts or false details are strictly prohibited.
              </p>
              <p>
                <strong>1.2 Personal Responsibility.</strong> You are responsible for keeping your login details safe. Never share your password or entry QR code with anyone else.
              </p>
            </div>
          </section>

          {/* SECTION 2: INFORMATION WE COLLECT */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <span className="text-blue-600">2. Information We Collect From You</span>
            </div>
            <p className="text-slate-500 text-xs pl-9">
              To make parking smooth and secure, our system stores and processes the following details:
            </p>

            {/* 9 ICON CARDS GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pl-9">
              <div className="flex items-center gap-2.5 rounded-xl bg-slate-100/70 px-3.5 py-2.5 text-slate-700 font-medium text-xs">
                <User className="h-4 w-4 text-blue-600 shrink-0" />
                <span>Full Name</span>
              </div>

              <div className="flex items-center gap-2.5 rounded-xl bg-slate-100/70 px-3.5 py-2.5 text-slate-700 font-medium text-xs">
                <CreditCard className="h-4 w-4 text-blue-600 shrink-0" />
                <span>Student / Staff ID Number</span>
              </div>

              <div className="flex items-center gap-2.5 rounded-xl bg-slate-100/70 px-3.5 py-2.5 text-slate-700 font-medium text-xs">
                <Mail className="h-4 w-4 text-blue-600 shrink-0" />
                <span>Institutional Email Address</span>
              </div>

              <div className="flex items-center gap-2.5 rounded-xl bg-slate-100/70 px-3.5 py-2.5 text-slate-700 font-medium text-xs">
                <Car className="h-4 w-4 text-blue-600 shrink-0" />
                <span>License Plate &amp; Vehicle Specs</span>
              </div>

              <div className="flex items-center gap-2.5 rounded-xl bg-slate-100/70 px-3.5 py-2.5 text-slate-700 font-medium text-xs">
                <Phone className="h-4 w-4 text-blue-600 shrink-0" />
                <span>Mobile Phone Number</span>
              </div>

              <div className="flex items-center gap-2.5 rounded-xl bg-slate-100/70 px-3.5 py-2.5 text-slate-700 font-medium text-xs">
                <History className="h-4 w-4 text-blue-600 shrink-0" />
                <span>Entry &amp; Exit Timestamps</span>
              </div>

              <div className="flex items-center gap-2.5 rounded-xl bg-slate-100/70 px-3.5 py-2.5 text-slate-700 font-medium text-xs">
                <Eye className="h-4 w-4 text-blue-600 shrink-0" />
                <span>Gate Camera Scan Logs</span>
              </div>

              <div className="flex items-center gap-2.5 rounded-xl bg-slate-100/70 px-3.5 py-2.5 text-slate-700 font-medium text-xs">
                <Key className="h-4 w-4 text-blue-600 shrink-0" />
                <span>Digital QR Entry Tokens</span>
              </div>

              <div className="flex items-center gap-2.5 rounded-xl bg-slate-100/70 px-3.5 py-2.5 text-slate-700 font-medium text-xs">
                <HardDrive className="h-4 w-4 text-blue-600 shrink-0" />
                <span>System History &amp; Activity</span>
              </div>
            </div>

            <div className="pl-9 space-y-2 text-xs text-slate-600 pt-2">
              <p>
                <strong>2.1 Why We Need This.</strong> We use this information to verify your identity at the entry gate, generate your unique QR passes, display available parking slots in real time, and keep the parking space secure.
              </p>
              <p>
                <strong>2.2 Data Safety.</strong> All personal records are safely stored and encrypted in our database. We do not sell or share your data with unauthorized third parties.
              </p>
            </div>
          </section>

          {/* SECTION 3: PARKING RULES */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                <Server className="h-4 w-4" />
              </div>
              <span className="text-blue-600">3. Parking Guidelines &amp; Restrictions</span>
            </div>
            <div className="pl-9 space-y-2 text-xs text-slate-600">
              <p>
                <strong>3.1 Proper Parking.</strong> Always park neatly within the painted slot lines. Do not block driveways, fire hydrants, or occupy reserved slots without proper authorization.
              </p>
              <p>
                <strong>3.2 QR Pass Policy.</strong> Screenshots or pass sharing with non-registered vehicles are strictly prohibited and will result in an automatic account suspension.
              </p>
            </div>
          </section>

          {/* SECTION 4: LIABILITY DISCLAIMER */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                <Scale className="h-4 w-4" />
              </div>
              <span className="text-blue-600">4. Vehicle Safety &amp; Responsibility</span>
            </div>
            <div className="pl-9 space-y-2 text-xs text-slate-600">
              <p>
                <strong>4.1 Park at Your Own Risk.</strong> SmartPark is a parking management software platform. SmartPark is not responsible for any lost, stolen, or damaged items inside your vehicle, or any vehicle damage while parked in the facility.
              </p>
            </div>
          </section>

          {/* SECTION 5: SUSPENSIONS */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                <Lock className="h-4 w-4" />
              </div>
              <span className="text-blue-600">5. Account Suspensions</span>
            </div>
            <div className="pl-9 space-y-2 text-xs text-slate-600">
              <p>
                Receiving three (3) parking violations or violating facility rules will lead to an automatic lock on your SmartPark account. You can submit an appeal through our Suspension Appeal portal.
              </p>
            </div>
          </section>

          {/* SECTION 6: POLICY UPDATES */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                <HelpCircle className="h-4 w-4" />
              </div>
              <span className="text-blue-600">6. Policy Changes</span>
            </div>
            <div className="pl-9 space-y-2 text-xs text-slate-600">
              <p>
                SmartPark reserves the right to update these terms at any time to improve system operations and security.
              </p>
            </div>
          </section>

        </div>

        {/* Footer / Actions */}
        <div className="pt-4 border-t border-slate-100 space-y-4 shrink-0">
          <div className="flex items-center justify-center gap-2.5">
            <Checkbox
              id="privacy-consent"
              checked={isChecked}
              onCheckedChange={(checked) => setIsChecked(checked === true)}
              className="h-4 w-4 rounded border-slate-300 data-[state=checked]:bg-[#0053CC] data-[state=checked]:border-[#0053CC]"
            />
            <label
              htmlFor="privacy-consent"
              className="text-xs font-medium text-slate-700 cursor-pointer select-none"
            >
              I have read, understood, and accept the Terms &amp; Data Privacy Policy
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-1">
            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate("/")}
              className="text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-semibold text-xs px-5 py-2.5 rounded-xl"
            >
              Decline
            </Button>
            
            <Button
              type="button"
              disabled={!isChecked}
              onClick={() => navigate("/")}
              className="bg-[#0053CC] hover:bg-[#0053CC]/90 text-white font-semibold text-xs px-6 py-2.5 rounded-xl disabled:opacity-50 transition-all shadow-sm"
            >
              Agree &amp; Continue
            </Button>
          </div>

        </div>

      </div>
    </div>
  );
}