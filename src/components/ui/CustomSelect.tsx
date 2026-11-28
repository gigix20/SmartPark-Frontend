import React, { useState, useMemo, useRef, useEffect } from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { 
  ChevronDown, 
  Search, 
  Check, 
  X, 
  Car, 
  Bike, 
  Palette, 
  PlusCircle
} from "lucide-react";
import { cn } from "cn";

export interface SelectOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  color?: string;
  badge?: string;
  description?: string;
  isSpecial?: boolean;
}

export interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: (string | SelectOption)[];
  placeholder?: string;
  searchable?: boolean;
  searchPlaceholder?: string;
  disabled?: boolean;
  error?: boolean | string;
  className?: string;
  menuClassName?: string;
  isColorSelect?: boolean;
  icon?: React.ReactNode;
  required?: boolean;
  id?: string;
}

const COLOR_MAP: Record<string, string> = {
  white: "#FFFFFF",
  black: "#0F172A",
  silver: "#94A3B8",
  gray: "#64748B",
  grey: "#64748B",
  red: "#EF4444",
  blue: "#3B82F6",
  green: "#10B981",
  yellow: "#EAB308",
  brown: "#78350F",
  orange: "#F97316",
  gold: "#F59E0B",
  maroon: "#881337",
  pink: "#EC4899",
  purple: "#8B5CF6",
  beige: "#D4C5B9",
  navy: "#1E3A8A",
  cyan: "#06B6D4",
};

export function CustomSelect({
  value,
  onChange,
  options,
  placeholder = "Select an option",
  searchable,
  searchPlaceholder = "Search...",
  disabled = false,
  error,
  className,
  menuClassName,
  isColorSelect = false,
  icon,
}: CustomSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Normalize options into SelectOption objects
  const normalizedOptions: SelectOption[] = useMemo(() => {
    return options.map((opt) => {
      if (typeof opt === "string") {
        const isOther = opt.toLowerCase().includes("other");
        return {
          value: opt,
          label: opt,
          isSpecial: isOther,
        };
      }
      return opt;
    });
  }, [options]);

  // Determine if search should be enabled
  const isSearchActive = searchable !== undefined 
    ? searchable 
    : normalizedOptions.length > 5;

  // Filter options based on search query
  const filteredOptions = useMemo(() => {
    if (!search.trim()) return normalizedOptions;
    const q = search.toLowerCase();
    return normalizedOptions.filter(
      (opt) =>
        opt.label.toLowerCase().includes(q) ||
        opt.value.toLowerCase().includes(q) ||
        (opt.description && opt.description.toLowerCase().includes(q))
    );
  }, [normalizedOptions, search]);

  // Current selected option
  const selectedOption = useMemo(() => {
    return normalizedOptions.find((opt) => opt.value === value);
  }, [normalizedOptions, value]);

  // Focus search input when popover opens
  useEffect(() => {
    if (open && isSearchActive) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    } else {
      setSearch("");
    }
  }, [open, isSearchActive]);

  // Render option visual indicator (Color dot or icon)
  const renderIndicator = (opt: SelectOption) => {
    if (isColorSelect) {
      const lower = opt.value.toLowerCase();
      if (lower === "other" || opt.isSpecial) {
        return (
          <span className="flex items-center justify-center w-4 h-4 rounded-full bg-gradient-to-tr from-pink-500 via-amber-400 to-indigo-500 shrink-0 shadow-xs">
            <Palette className="w-2.5 h-2.5 text-white" />
          </span>
        );
      }
      const hex = opt.color || COLOR_MAP[lower] || "#CBD5E1";
      return (
        <span
          className="w-3.5 h-3.5 rounded-full shrink-0 border border-slate-300 dark:border-slate-600 shadow-xs"
          style={{ backgroundColor: hex }}
        />
      );
    }

    if (opt.icon) {
      return <span className="shrink-0">{opt.icon}</span>;
    }

    if (opt.value === "Car") {
      return <Car className="w-3.5 h-3.5 shrink-0 text-slate-500 dark:text-slate-400" />;
    }

    if (opt.value === "Motorcycle") {
      return <Bike className="w-3.5 h-3.5 shrink-0 text-slate-500 dark:text-slate-400" />;
    }

    if (opt.isSpecial || opt.value.toLowerCase().includes("other")) {
      return <PlusCircle className="w-3.5 h-3.5 shrink-0 text-[#0053CC] dark:text-blue-400" />;
    }

    return null;
  };

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
      <PopoverPrimitive.Trigger asChild disabled={disabled}>
        <button
          type="button"
          className={cn(
            "group relative flex items-center justify-between w-full h-11 px-3.5 rounded-xl border bg-white dark:bg-slate-800 text-xs font-medium text-slate-800 dark:text-slate-200 text-left transition-all duration-200 outline-none cursor-pointer select-none",
            "hover:border-slate-400 dark:hover:border-slate-600",
            "focus-visible:ring-2 focus-visible:ring-[#0053CC]/20 focus-visible:border-[#0053CC]",
            open && "border-[#0053CC] ring-2 ring-[#0053CC]/20 dark:border-blue-500",
            error 
              ? "border-red-500 focus-visible:ring-red-500/20 focus-visible:border-red-500" 
              : "border-slate-300 dark:border-slate-700",
            disabled && "opacity-50 cursor-not-allowed bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800",
            className
          )}
        >
          <div className="flex items-center gap-2.5 truncate pr-2">
            {icon && <span className="shrink-0 text-slate-400">{icon}</span>}
            {selectedOption ? (
              <div className="flex items-center gap-2 truncate">
                {renderIndicator(selectedOption)}
                <span className="truncate text-slate-900 dark:text-white font-medium">
                  {selectedOption.label}
                </span>
              </div>
            ) : (
              <span className="text-slate-400 dark:text-slate-500 font-normal">
                {placeholder}
              </span>
            )}
          </div>

          <ChevronDown
            className={cn(
              "w-4 h-4 shrink-0 text-slate-400 transition-transform duration-200",
              open && "rotate-180 text-[#0053CC] dark:text-blue-400"
            )}
          />
        </button>
      </PopoverPrimitive.Trigger>

      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          align="start"
          sideOffset={6}
          className={cn(
            "z-[9999] w-[--radix-popover-trigger-width] min-w-[200px] max-w-[calc(100vw-32px)] rounded-xl border border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md shadow-xl p-1.5 text-xs outline-none",
            "animate-in fade-in-0 zoom-in-95 duration-150 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
            menuClassName
          )}
        >
          {/* Search bar inside popover */}
          {isSearchActive && (
            <div className="relative mb-1.5 px-1 pt-0.5">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full h-8 pl-8 pr-7 rounded-lg bg-slate-100 dark:bg-slate-700/60 border-none text-xs text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#0053CC] dark:focus:ring-blue-400 transition-all"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-400 transition-colors cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          )}

          {/* Options list */}
          <div className="max-h-56 overflow-y-auto space-y-0.5 pr-0.5 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700">
            {filteredOptions.length === 0 ? (
              <div className="py-6 px-3 text-center text-slate-400 dark:text-slate-500">
                <p className="text-xs font-medium">No results found</p>
                {search && (
                  <p className="text-[11px] mt-0.5 opacity-75">
                    No option matches "{search}"
                  </p>
                )}
              </div>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected = opt.value === value;
                const isSpecial = opt.isSpecial || opt.value.toLowerCase().includes("other");

                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      onChange(opt.value);
                      setOpen(false);
                    }}
                    className={cn(
                      "flex items-center justify-between w-full px-3 py-2 rounded-lg text-left transition-colors duration-150 cursor-pointer select-none",
                      isSelected
                        ? "bg-blue-50 dark:bg-blue-900/30 text-[#0053CC] dark:text-blue-400 font-semibold"
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/60",
                      isSpecial && !isSelected && "text-[#0053CC] dark:text-blue-400 font-semibold bg-blue-50/40 dark:bg-blue-950/20 border border-dashed border-blue-200 dark:border-blue-900/50 mt-1"
                    )}
                  >
                    <div className="flex items-center gap-2.5 truncate pr-2">
                      {renderIndicator(opt)}
                      <div className="truncate">
                        <div className="truncate text-xs">{opt.label}</div>
                        {opt.description && (
                          <div className="text-[10px] text-slate-400 dark:text-slate-500 truncate">
                            {opt.description}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {opt.badge && (
                        <span className="px-1.5 py-0.5 text-[9px] font-semibold rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                          {opt.badge}
                        </span>
                      )}
                      {isSelected && (
                        <Check className="w-3.5 h-3.5 text-[#0053CC] dark:text-blue-400 shrink-0" />
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}
