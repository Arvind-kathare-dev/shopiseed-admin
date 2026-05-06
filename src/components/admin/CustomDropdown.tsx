import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check } from "lucide-react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { cn } from "@/lib/utils";

interface Option {
  value: string;
  label: string;
  icon?: React.ElementType;
}

interface CustomDropdownProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  className?: string;
  icon?: React.ElementType;
}

export function CustomDropdown({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  label,
  className,
  icon: Icon
}: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className={cn("space-y-3 w-full", className)}>
      {label && <label className="block text-sm font-medium text-foreground/80 ml-1 mb-1 cursor-pointer">{label}</label>}
      
      <PopoverPrimitive.Root open={isOpen} onOpenChange={setIsOpen}>
        <PopoverPrimitive.Trigger asChild>
          <button
            type="button"
            className={cn(
              "w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm transition-all duration-200 cursor-pointer",
              "bg-muted/40 border border-border/50 hover:border-primary/40",
              "focus:outline-none focus:ring-2 focus:ring-primary/10 text-left",
              isOpen && "border-primary/50 bg-background shadow-soft"
            )}
          >
            <div className="flex items-center gap-2.5">
              {Icon && <Icon className="size-4 text-muted-foreground" />}
              {selectedOption ? (
                <span className="flex items-center gap-2 font-medium">
                  {selectedOption.icon && <selectedOption.icon className="size-3.5" />}
                  {selectedOption.label}
                </span>
              ) : (
                <span className="text-muted-foreground">{placeholder}</span>
              )}
            </div>
            <ChevronDown className={cn("size-4 text-muted-foreground transition-transform duration-300", isOpen && "rotate-180")} />
          </button>
        </PopoverPrimitive.Trigger>

        <PopoverPrimitive.Portal>
          <PopoverPrimitive.Content 
            align="start" 
            sideOffset={4}
            className="z-100 w-(--radix-popover-trigger-width)"
          >
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.98 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="bg-card/90 backdrop-blur-xl border border-border/50 rounded-xl shadow-elegant overflow-hidden py-1.5"
                >
                  <div className="max-h-[240px] overflow-y-auto scrollbar-thin">
                    {options.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => {
                          onChange(option.value);
                          setIsOpen(false);
                        }}
                        className={cn(
                          "w-full flex items-center justify-between px-4 py-2 text-sm transition-colors text-left cursor-pointer",
                          "hover:bg-primary/10 group",
                          value === option.value ? "text-primary font-semibold bg-primary/5" : "text-foreground/80"
                        )}
                      >
                        <div className="flex items-center gap-2.5">
                          {option.icon && <option.icon className={cn("size-4", value === option.value ? "text-primary" : "text-muted-foreground group-hover:text-primary/70")} />}
                          {option.label}
                        </div>
                        {value === option.value && (
                          <motion.div layoutId="dropdown-check">
                            <Check className="size-4 text-primary" />
                          </motion.div>
                        )}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </PopoverPrimitive.Content>
        </PopoverPrimitive.Portal>
      </PopoverPrimitive.Root>
    </div>
  );
}
