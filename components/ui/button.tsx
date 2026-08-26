import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  isLoading?: boolean;
}

const variantStyles: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary: "bg-amber-500 text-white hover:bg-amber-600 active:bg-amber-700 shadow-xs",
  secondary: "bg-neutral-100 text-neutral-800 hover:bg-neutral-200 active:bg-neutral-300",
  ghost: "bg-transparent text-neutral-700 hover:bg-neutral-100 active:bg-neutral-200",
  danger: "bg-red-50 text-red-700 hover:bg-red-100 active:bg-red-200 border border-red-200",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", isLoading, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          "w-full rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-150 active:scale-[0.98]",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100",
          "flex items-center justify-center gap-2 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-1",
          variantStyles[variant],
          className
        )}
        {...props}
      >
        {isLoading ? "Memproses..." : children}
      </button>
    );
  }
);
Button.displayName = "Button";
